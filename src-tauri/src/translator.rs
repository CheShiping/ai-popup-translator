use crate::config::AppConfig;
use crate::error::{AppError, Result};
use crate::config::TranslationResult;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::OnceLock;

static HTTP_CLIENT: OnceLock<Client> = OnceLock::new();

fn get_client() -> &'static Client {
    HTTP_CLIENT.get_or_init(|| {
        Client::builder()
            .timeout(std::time::Duration::from_secs(10))
            .build()
            .expect("Failed to build HTTP client")
    })
}

#[derive(Serialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    temperature: f32,
    max_tokens: u32,
}

#[derive(Deserialize)]
struct ChatResponse {
    choices: Vec<ChatChoice>,
}

#[derive(Deserialize)]
struct ChatChoice {
    message: ChatMessageResponse,
}

#[derive(Deserialize)]
struct ChatMessageResponse {
    content: String,
}

fn build_prompt(text: String, custom_prompt: Option<String>) -> String {
    let base_prompt = custom_prompt.unwrap_or_else(|| {
        "You are a professional English-Chinese translator. For words, provide: phonetic transcription, part of speech, Chinese definition, and an example sentence. For sentences, provide a natural Chinese translation. Format the response as JSON with fields: translation, phonetic (optional), part_of_speech (optional), definition (optional), example (optional).".to_string()
    });

    format!(
        "{}\n\nText to translate: \"{}\"\n\nRespond ONLY with valid JSON in this exact format:\n{{\"translation\": \"...\", \"phonetic\": \"... or null\", \"part_of_speech\": \"... or null\", \"definition\": \"... or null\", \"example\": \"... or null\"}}",
        base_prompt, text
    )
}

fn parse_translation_response(json_str: &str, original: String) -> Result<TranslationResult> {
    // Try to extract JSON from the response (handle markdown code blocks)
    let cleaned = json_str
        .trim()
        .trim_start_matches("```json")
        .trim_start_matches("```")
        .trim_end_matches("```")
        .trim();

    let parsed: serde_json::Value = serde_json::from_str(cleaned)
        .map_err(|e| AppError::Translation(format!("Failed to parse response: {}", e)))?;

    let translation = parsed["translation"]
        .as_str()
        .unwrap_or("")
        .to_string();

    if translation.is_empty() {
        return Err(AppError::Translation("Empty translation received".to_string()));
    }

    let get_optional_field = |key: &str| -> Option<String> {
        parsed[key].as_str().filter(|s| !s.is_empty() && s != "null").map(|s| s.to_string())
    };

    let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
    let tags = if original.contains(' ') {
        vec!["#å¥æ".to_string()]
    } else {
        vec!["#åè¯".to_string()]
    };

    Ok(TranslationResult {
        original,
        translation,
        phonetic: get_optional_field("phonetic"),
        part_of_speech: get_optional_field("part_of_speech"),
        definition: get_optional_field("definition"),
        example: get_optional_field("example"),
        timestamp,
        tags,
    })
}

pub async fn translate_text(text: String, config: &AppConfig) -> Result<TranslationResult> {
    if config.api_key.is_empty() {
        return Err(AppError::Translation("API key not configured".to_string()));
    }

    let endpoint = if config.custom_endpoint.is_empty() {
        match config.provider.as_str() {
            "openai" => "https://api.openai.com/v1/chat/completions",
            "deepseek" => "https://api.deepseek.com/v1/chat/completions",
            "anthropic" => "https://api.anthropic.com/v1/messages",
            "moonshot" => "https://api.moonshot.cn/v1/chat/completions",
            _ => "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        }
    } else {
        &config.custom_endpoint
    };

    let prompt = build_prompt(text.clone(), Some(config.custom_prompt.clone()).filter(|s| !s.is_empty()));

    let request = ChatRequest {
        model: config.model.clone(),
        messages: vec![
            ChatMessage {
                role: "system".to_string(),
                content: "You are a precise translation assistant. Always respond with valid JSON only.".to_string(),
            },
            ChatMessage {
                role: "user".to_string(),
                content: prompt,
            },
        ],
        temperature: 0.3,
        max_tokens: 1024,
    };

    let response = get_client()
        .post(endpoint)
        .header("Authorization", format!("Bearer {}", config.api_key))
        .header("Content-Type", "application/json")
        .json(&request)
        .send()
        .await
        .map_err(|e| AppError::Translation(format!("Request failed: {}", e)))?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(AppError::Translation(format!("API error {}: {}", status, body)));
    }

    let chat_response: ChatResponse = response
        .json()
        .await
        .map_err(|e| AppError::Translation(format!("Failed to parse API response: {}", e)))?;

    let content = chat_response
        .choices
        .first()
        .map(|c| c.message.content.clone())
        .unwrap_or_default();

    parse_translation_response(&content, text)
}

pub async fn test_connection(config: &AppConfig) -> Result<String> {
    let test_text = "hello".to_string();
    let _ = translate_text(test_text, config).await?;
    Ok("Connection successful".to_string())
}

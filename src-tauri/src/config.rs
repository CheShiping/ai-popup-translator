use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TranslationResult {
    pub original: String,
    pub translation: String,
    pub phonetic: Option<String>,
    pub part_of_speech: Option<String>,
    pub definition: Option<String>,
    pub example: Option<String>,
    pub timestamp: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HistoryEntry {
    pub id: String,
    pub original: String,
    pub translation: String,
    pub phonetic: Option<String>,
    pub part_of_speech: Option<String>,
    pub definition: Option<String>,
    pub example: Option<String>,
    pub timestamp: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiProvider {
    pub name: String,
    pub endpoint: String,
    pub models: Vec<String>,
}

impl Default for ApiProvider {
    fn default() -> Self {
        Self {
            name: "qwen".to_string(),
            endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions".to_string(),
            models: vec![
                "qwen-turbo".to_string(),
                "qwen-plus".to_string(),
                "qwen-max".to_string(),
            ],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    #[serde(default = "default_api_key")]
    pub api_key: String,
    #[serde(default = "default_provider")]
    pub provider: String,
    #[serde(default = "default_model")]
    pub model: String,
    #[serde(default = "default_endpoint")]
    pub custom_endpoint: String,
    #[serde(default = "default_shortcut")]
    pub shortcut: String,
    #[serde(default = "default_auto_save")]
    pub auto_save: bool,
    #[serde(default = "default_obsidian_path")]
    pub obsidian_path: String,
    #[serde(default = "default_theme")]
    pub theme: String,
    #[serde(default = "default_max_history")]
    pub max_history: u32,
    #[serde(default = "default_custom_prompt")]
    pub custom_prompt: String,
    #[serde(default = "default_tags")]
    pub default_tags: Vec<String>,
}

fn default_api_key() -> String {
    String::new()
}
fn default_provider() -> String {
    "qwen".to_string()
}
fn default_model() -> String {
    "qwen-turbo".to_string()
}
fn default_endpoint() -> String {
    String::new()
}
fn default_shortcut() -> String {
    "CmdOrCtrl+Shift+Q".to_string()
}
fn default_auto_save() -> bool {
    true
}
fn default_obsidian_path() -> String {
    let home = dirs::home_dir().unwrap_or_default();
    home.join("Documents")
        .join("Obsidian")
        .join("AIç¯è¯åº")
        .to_string_lossy()
        .to_string()
}
fn default_theme() -> String {
    "system".to_string()
}
fn default_max_history() -> u32 {
    1000
}
fn default_custom_prompt() -> String {
    String::new()
}
fn default_tags() -> Vec<String> {
    vec!["#è±è¯å¦ä¹".to_string()]
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            api_key: default_api_key(),
            provider: default_provider(),
            model: default_model(),
            custom_endpoint: default_endpoint(),
            shortcut: default_shortcut(),
            auto_save: default_auto_save(),
            obsidian_path: default_obsidian_path(),
            theme: default_theme(),
            max_history: default_max_history(),
            custom_prompt: default_custom_prompt(),
            default_tags: default_tags(),
        }
    }
}

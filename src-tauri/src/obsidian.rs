use crate::config::TranslationResult;
use crate::error::{AppError, Result};
use chrono::Local;
use std::fs;
use std::path::PathBuf;

fn ensure_obsidian_vault(path: &str) -> Result<PathBuf> {
    let vault_path = PathBuf::from(path);
    if !vault_path.exists() {
        fs::create_dir_all(&vault_path)
            .map_err(|e| AppError::Obsidian(format!("Failed to create vault directory: {}", e)))?;
    }
    Ok(vault_path)
}

fn format_entry(result: &TranslationResult) -> String {
    let mut entry = String::new();

    if result.original.contains(' ') {
        // Sentence translation
        entry.push_str(&format!("\n### {}\n", result.original));
        entry.push_str(&format!("**ç¯è¯**: {}\n", result.translation));
    } else {
        // Word translation
        entry.push_str(&format!("\n### {}\n", result.original));
        if let Some(ref phonetic) = result.phonetic {
            entry.push_str(&format!("**é³æ¨**: {}\n", phonetic));
        }
        if let Some(ref pos) = result.part_of_speech {
            entry.push_str(&format!("**è¯æ§**: {}\n", pos));
        }
        if let Some(ref def) = result.definition {
            entry.push_str(&format!("**éä¹**: {}\n", def));
        }
        if let Some(ref example) = result.example {
            entry.push_str(&format!("**ä¾å**: {} ã\n", example));
        }
    }

    // Add tags
    if !result.tags.is_empty() {
        let tags_str = result.tags.join(" ");
        entry.push_str(&format!("\n{}\n", tags_str));
    }

    entry.push_str("\n---\n");
    entry
}

pub fn save_translation(result: &TranslationResult, vault_path: &str) -> Result<String> {
    let vault = ensure_obsidian_vault(vault_path)?;
    let today = Local::now().format("%Y-%m-%d").to_string();
    let file_path = vault.join(format!("{}.md", today));

    let entry = format_entry(result);

    if file_path.exists() {
        // Append to existing file
        let mut content = fs::read_to_string(&file_path)
            .map_err(|e| AppError::Obsidian(format!("Failed to read file: {}", e)))?;

        // Check if this word already exists (for words, not sentences)
        if !result.original.contains(' ') && content.contains(&format!("### {}", result.original)) {
            // Word already exists, skip duplicate
            return Ok("Entry already exists, skipped".to_string());
        }

        content.push_str(&entry);
        fs::write(&file_path, content)
            .map_err(|e| AppError::Obsidian(format!("Failed to write file: {}", e)))?;
    } else {
        // Create new daily note
        let header = format!("# {}\n\n> AI ç¯è¯è®°å½ - çåè¯è¯\n", today);
        let content = header + &entry;
        fs::write(&file_path, content)
            .map_err(|e| AppError::Obsidian(format!("Failed to create file: {}", e)))?;
    }

    Ok(format!("Saved to {}", file_path.display()))
}

pub fn search_in_vault(query: &str, vault_path: &str) -> Result<Vec<String>> {
    let vault = PathBuf::from(vault_path);
    if !vault.exists() {
        return Ok(vec![]);
    }

    let mut results = Vec::new();
    let entries = fs::read_dir(&vault)
        .map_err(|e| AppError::Obsidian(format!("Failed to read vault: {}", e)))?;

    for entry in entries.flatten() {
        if entry.path().extension().and_then(|e| e.to_str()) == Some("md") {
            if let Ok(content) = fs::read_to_string(entry.path()) {
                if content.to_lowercase().contains(&query.to_lowercase()) {
                    results.push(content);
                }
            }
        }
    }

    Ok(results)
}

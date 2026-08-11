use crate::config::{AppConfig, HistoryEntry, TranslationResult};
use crate::error::Result;
use crate::obsidian;
use crate::translator;
use crate::window;
use chrono::Local;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};

struct AppState {
    config: Mutex<AppConfig>,
    history: Mutex<Vec<HistoryEntry>>,
}

impl AppState {
    fn new(config: AppConfig) -> Self {
        Self {
            config: Mutex::new(config),
            history: Mutex::new(Vec::new()),
        }
    }
}

#[tauri::command]
pub async fn translate(
    text: String,
    state: State<'_, AppState>,
    app: AppHandle,
) -> Result<TranslationResult> {
    let config = state.config.lock().unwrap().clone();
    let result = translator::translate_text(text, &config).await?;

    // Save to history
    let entry = HistoryEntry {
        id: uuid::Uuid::new_v4().to_string(),
        original: result.original.clone(),
        translation: result.translation.clone(),
        phonetic: result.phonetic.clone(),
        part_of_speech: result.part_of_speech.clone(),
        definition: result.definition.clone(),
        example: result.example.clone(),
        timestamp: result.timestamp.clone(),
        tags: result.tags.clone(),
    };
    state.history.lock().unwrap().push(entry);

    // Auto-save to Obsidian if enabled
    if config.auto_save && !config.obsidian_path.is_empty() {
        let _ = obsidian::save_translation(&result, &config.obsidian_path);
    }

    // Emit event to frontend
    let _ = app.emit("translation-complete", &result);

    Ok(result)
}

#[tauri::command]
pub fn get_clipboard_text() -> Result<String> {
    // Note: In Tauri 2, clipboard is handled via the clipboard plugin
    // This is a placeholder - actual clipboard reading happens via JS API
    Ok(String::new())
}

#[tauri::command]
pub fn save_to_obsidian(
    result: TranslationResult,
    state: State<'_, AppState>,
) -> Result<String> {
    let config = state.config.lock().unwrap();
    obsidian::save_translation(&result, &config.obsidian_path)
}

#[tauri::command]
pub fn get_config(state: State<'_, AppState>) -> Result<AppConfig> {
    Ok(state.config.lock().unwrap().clone())
}

#[tauri::command]
pub fn set_config(
    config: AppConfig,
    state: State<'_, AppState>,
) -> Result<()> {
    *state.config.lock().unwrap() = config;
    Ok(())
}

#[tauri::command]
pub fn get_history(state: State<'_, AppState>) -> Result<Vec<HistoryEntry>> {
    Ok(state.history.lock().unwrap().clone())
}

#[tauri::command]
pub fn search_history(
    query: String,
    state: State<'_, AppState>,
) -> Result<Vec<HistoryEntry>> {
    let history = state.history.lock().unwrap();
    let results: Vec<HistoryEntry> = history
        .iter()
        .filter(|h| {
            h.original.to_lowercase().contains(&query.to_lowercase())
                || h.translation.to_lowercase().contains(&query.to_lowercase())
        })
        .cloned()
        .collect();
    Ok(results)
}

#[tauri::command]
pub fn show_popup(
    x: f64,
    y: f64,
    app: AppHandle,
) -> Result<()> {
    window::show_translation_window(&app, x, y)?;
    Ok(())
}

#[tauri::command]
pub fn hide_popup(app: AppHandle) -> Result<()> {
    window::hide_translation_window(&app)?;
    Ok(())
}

#[tauri::command]
pub async fn test_api_connection(
    state: State<'_, AppState>,
) -> Result<String> {
    let config = state.config.lock().unwrap().clone();
    translator::test_connection(&config).await
}

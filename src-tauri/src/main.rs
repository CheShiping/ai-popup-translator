mod commands;
mod config;
mod error;
mod obsidian;
mod tray;
mod translator;
mod window;

use commands::*;
use tauri::Manager;

fn build_app() -> tauri::Builder<tauri::Wry> {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            // Initialize logger
            env_logger::init();

            // Initialize config store
            let _config = config::AppConfig::init(app.handle())?;

            // Setup system tray
            tray::create_tray(app.handle())?;

            // Hide the main window on startup
            if let Some(window) = app.get_webview_window("main") {
                window.hide()?;
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                window.hide().unwrap();
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::translate,
            commands::get_clipboard_text,
            commands::save_to_obsidian,
            commands::get_config,
            commands::set_config,
            commands::get_history,
            commands::search_history,
            commands::show_popup,
            commands::hide_popup,
            commands::test_api_connection,
        ])
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    build_app()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run();
}

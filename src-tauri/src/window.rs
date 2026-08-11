use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize};

pub fn show_translation_window(app: &AppHandle, x: f64, y: f64) -> tauri::Result<()> {
    // Create or show the popup window
    if let Some(window) = app.get_webview_window("popup") {
        window.show()?;
        window.set_position(PhysicalPosition::new(x, y))?;
        window.set_focus().ok();
    }
    Ok(())
}

pub fn hide_translation_window(app: &AppHandle) -> tauri::Result<()> {
    if let Some(window) = app.get_webview_window("popup") {
        window.hide()?;
    }
    Ok(())
}

pub fn position_near_cursor(app: &AppHandle, cursor_x: f64, cursor_y: f64) -> tauri::Result<()> {
    let window = app.get_webview_window("main").ok_or(tauri::Error::WindowNotFound)?;
    let size = window.outer_size()?;

    // Position window near cursor, with screen-edge collision detection
    let x = (cursor_x + 20.0).min(1920.0 - size.width as f64);
    let y = (cursor_y + 20.0).min(1080.0 - size.height as f64);

    window.set_position(PhysicalPosition::new(x, y))?;
    Ok(())
}

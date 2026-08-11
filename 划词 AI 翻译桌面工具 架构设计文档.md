# 划词 AI 翻译桌面工具 - 架构设计文档

> 版本：v4.0（Tauri + React 重构）
> 目标平台：Windows 10/11（可扩展 macOS）
> 桌面框架：Tauri 2
> 前端框架：React 18 + Vite 5 + TypeScript 5
> 最后更新：2026-08-11

---

## 1. 设计概述

### 1.1 设计目标

打造一款**轻量、快速、不抢注意力**的桌面翻译工具。核心闭环：

`
`选中文字` → 快捷键触发 → 弹窗展示翻译 → 自动/手动保存到 Obsidian
`

整个流程 ≤ 3 秒，界面绝不打断用户的阅读流。

### 1.2 核心约束

| 约束 | 说明 |
|------|------|
| **安全** | API Key 仅在 Rust 后端，前端通过 Tauri IPC 调用 |
| **轻量** | Tauri 原生能力（无 node nut-js），安装包 < 10MB |
| **快速** | 翻译延迟 ≤ 2s，弹窗出现 ≤ 200ms |
| **单一数据源** | Obsidian 文件是唯一真相，历史记录从中索引 |
| **不抢焦点** | 弹窗不获取输入焦点，不打断用户操作 |

---

## 2. 总体架构

### 2.1 分层架构图

`
┌──────────────────────────────────────────────────────────────────┐
│                      用户交互层                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────────┐   │
│  │ 系统托盘 │  │ 快捷键   │  │ 翻译弹窗  │  │ 设置面板      │   │
│  │ (Tray)   │  │(全局)    │  │ (React)   │  │ (React)       │   │
│  └──────────┘  └──────────┘  └───────────┘  └───────────────┘   │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│                    Tauri 前端层（Webview）                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    React 应用                            │   │
│  │  • 翻译弹窗组件  • 历史面板组件  • 设置面板组件         │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              状态管理（Zustand）                         │   │
│  │  • 翻译状态  • 主题状态  • 配置状态  • 历史状态         │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│            Tauri IPC（invoke / command）                         │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│                    Tauri 后端层（Rust）                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    窗口管理器                             │   │
│  │  • 弹窗创建/销毁    • 多显示器定位    • 焦点管理         │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ 快捷键服务   │  │ 翻译服务     │  │ 知识库服务           │   │
│  │ (Tauri       │  │ (大模型API)  │  │ (Obsidian 文件读写)  │   │
│  │  全局快捷键)  │  │              │  │                      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ 剪贴板服务   │  │ 配置管理     │  │ 历史索引             │   │
│  │ (Tauri       │  │ (tauri-      │  │ (从 Obsidian 文件    │   │
│  │  原生API)    │  │  plugin-store)│  │  建立内存索引)      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│                      外部集成层                                  │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │       大模型 API         │  │      Obsidian 笔记库        │   │
│  │ (OpenAI/通义千问/文心一言)│  │  (本地 Markdown 文件存储)   │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
`

### 2.2 进程职责

| 进程 | 职责 |
|------|------|
| **Tauri 后端（Rust）** | 应用生命周期、系统托盘、全局快捷键、剪贴板读取、大模型 API 调用、窗口创建与定位、知识库读写、配置持久化、历史索引 |
| **Tauri 前端（React）** | UI 渲染、翻译结果展示、历史记录展示、设置管理，通过 @tauri-apps/api 调用后端命令 |

---

## 3. 技术栈与版本

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| Tauri | 2.0+ | 桌面框架 | Rust 后端 + Webview，安装包 < 10MB |
| React | 18.3+ | UI 框架 | 渲染进程 |
| Vite | 5.4+ | 构建工具 | 开发体验 |
| TypeScript | 5.4+ | 类型安全 | 全栈 |
| Zustand | 4.5+ | 状态管理 | React 端全局状态 |
| tauri-plugin-store | 2.0+ | 配置持久化 | Rust 端 KV 存储 |
| tauri-plugin-clipboard | 2.0+ | 剪贴板操作 | Tauri 原生插件 |
| tauri-plugin-global-shortcut | 2.0+ | 全局快捷键 | Tauri 原生插件 |
| tauri-plugin-dialog | 2.0+ | 文件/目录选择 | 配置 Obsidian 路径 |
| reqwest | 0.12+ | HTTP 请求 | Rust 端调用大模型 |
| tokio | 1.39+ | 异步运行时 | Rust 端 |
| serde / serde_json | 1.0+ | 序列化 | Rust 端 |
| chrono | 0.4+ | 日期时间 | Rust 端 |
| anyhow | 1.0+ | 错误处理 | Rust 端 |

### 3.1 为什么从 Electron 迁移到 Tauri？

| 维度 | Electron | Tauri 2 |
|------|----------|---------|
| **安装包体积** | ~80-120MB | < 10MB |
| **内存占用** | ~150-300MB | ~50-80MB |
| **启动速度** | 1-3s | < 500ms |
| **安全模型** | Node.js 集成风险高 | Rust 后端 + IPC，无 Node 运行时 |
| **后端语言** | JavaScript/TypeScript | Rust（内存安全 + 高性能） |
| **系统集成** | 依赖 node 模块 | 原生 Rust 绑定，更稳定 |
| **WebView** | Chromium 内嵌 | 系统 WebView（Edge/WebKit） |

### 3.2 取词方案

**方案：直接读取剪贴板（Tauri 原生插件）**

`	ypescript
import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager'

async function getSelectedText(): Promise<string> {
  const previousContent = await readText() ?? ''
  await writeText('')
  await simulateCopy()
  await new Promise(resolve => setTimeout(resolve, 150))
  const selectedText = await readText() ?? ''
  if (previousContent) {
    await writeText(previousContent)
  }
  return selectedText
}
`

**备选方案：使用 enigo（Rust 端键鼠模拟）**

`	oml
# Cargo.toml
enigo = "0.2"
`

`ust
use enigo::{Enigo, Key, KeyboardControllable};

fn simulate_copy() {
    let mut enigo = Enigo::new();
    enigo.key_down(Key::Control);
    enigo.key_click(Key::Layout('c'));
    enigo.key_up(Key::Control);
}
`

---

## 4. 目录结构设计

`
my-ai-dict/
├── src-tauri/                    # Tauri 后端（Rust）
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/
│   │   └── default.json          # 权限配置
│   └── src/
│       ├── main.rs               # 入口
│       ├── lib.rs                # 命令注册
│       ├── tray.rs               # 系统托盘
│       ├── shortcut.rs           # 全局快捷键
│       ├── clipboard.rs          # 剪贴板服务
│       ├── translator/
│       │   ├── mod.rs            # 翻译服务入口
│       │   ├── openai.rs         # OpenAI 兼容
│       │   ├── qwen.rs           # 通义千问
│       │   └── prompts.rs        # 提示词模板
│       ├── knowledge_base/
│       │   ├── mod.rs
│       │   ├── note_writer.rs    # 笔记写入
│       │   ├── note_reader.rs    # 笔记读取
│       │   └── history_index.rs  # 历史索引
│       ├── window_manager.rs     # 窗口管理
│       ├── config.rs             # 配置管理
│       └── theme.rs              # 主题检测
├── src/                          # React 前端
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── TranslationPopup.tsx
│   │   ├── HistoryPanel.tsx
│   │   └── SettingsPanel.tsx
│   ├── stores/
│   │   ├── translation.ts        # 翻译状态
│   │   ├── theme.ts              # 主题状态
│   │   └── config.ts             # 配置状态
│   ├── hooks/
│   │   ├── useTheme.ts           # 主题 Hook
│   │   └── useTauri.ts           # Tauri API Hook
│   ├── types/
│   │   ├── translation.ts        # 翻译类型
│   │   └── config.ts             # 配置类型
│   └── styles/
│       └── design-tokens.css     # 设计变量
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
`

---

## 5. 核心模块详细设计

### 5.1 剪贴板服务 clipboard.rs

`ust
use tauri::command;

#[command]
pub async fn get_selected_text() -> Result<String, String> {
    // 1. 保存当前剪贴板内容
    let clipboard = app_handle.clipboard();
    let previous = clipboard.read_text().unwrap_or_default();

    // 2. 清空剪贴板并模拟复制
    clipboard.write_text("").map_err(|e| e.to_string())?;
    simulate_copy();
    tokio::time::sleep(tokio::time::Duration::from_millis(150)).await;

    // 3. 读取选中文本
    let selected = clipboard.read_text().unwrap_or_default();

    // 4. 恢复剪贴板
    if !previous.is_empty() {
        clipboard.write_text(previous).ok();
    }

    Ok(selected)
}

fn simulate_copy() {
    use enigo::{Enigo, Key, KeyboardControllable};
    let mut enigo = Enigo::new();
    enigo.key_down(Key::Control);
    enigo.key_click(Key::Layout('c'));
    enigo.key_up(Key::Control);
}
`

### 5.2 翻译命令 	ranslator/mod.rs

`ust
use tauri::command;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct TranslationResult {
    pub original: String,
    pub translation: String,
    pub phonetic: Option<String>,
    pub part_of_speech: Option<String>,
    pub example: Option<String>,
    pub model: String,
}

#[command]
pub async fn translate(text: String, app_handle: tauri::AppHandle) -> Result<TranslationResult, String> {
    let config = crate::config::get_config(&app_handle);
    
    match config.model.as_str() {
        "qwen-turbo" | "qwen-plus" | "qwen-max" => {
            crate::translator::qwen::translate(&text, &config).await
        }
        _ => crate::translator::openai::translate(&text, &config).await,
    }
}
`

### 5.3 知识库服务 knowledge_base/mod.rs

`ust
use std::path::PathBuf;
use std::fs;
use chrono::Local;

#[derive(Debug, Clone)]
pub struct TranslationRecord {
    pub id: String,
    pub original: String,
    pub translation: String,
    pub phonetic: Option<String>,
    pub part_of_speech: Option<String>,
    pub example: Option<String>,
    pub timestamp: i64,
    pub tags: Vec<String>,
}

pub struct NoteWriter {
    base_path: PathBuf,
}

impl NoteWriter {
    pub fn new(base_path: PathBuf) -> Self {
        fs::create_dir_all(&base_path).ok();
        Self { base_path }
    }

    fn get_today_note_path(&self) -> PathBuf {
        let date = Local::now().format("%Y-%m-%d").to_string();
        self.base_path.join(format!("{}.md", date))
    }

    fn generate_content(&self, record: &TranslationRecord) -> String {
        let mut content = format!("### {}\n", record.original);

        if let Some(phonetic) = &record.phonetic {
            content.push_str(&format!("**音标**: {}\n", phonetic));
        }
        if let Some(pos) = &record.part_of_speech {
            content.push_str(&format!("**词性**: {}\n", pos));
        }

        content.push_str(&format!("**翻译**: {}\n", record.translation));

        if let Some(example) = &record.example {
            content.push_str(&format!("**例句**: {}\n", example));
        }

        if !record.tags.is_empty() {
            let tags: Vec<String> = record.tags.iter().map(|t| format!("#{}", t)).collect();
            content.push_str(&format!("**标签**: {}\n", tags.join(" ")));
        }

        let time = Local::now().format("%H:%M:%S").to_string();
        content.push_str(&format!("**时间**: {}\n\n---\n\n", time));
        content
    }

    pub async fn is_duplicate(&self, original: &str) -> bool {
        let path = self.get_today_note_path();
        if !path.exists() { return false; }
        match fs::read_to_string(&path) {
            Ok(content) => content.contains(&format!("### {}", original)),
            Err(_) => false,
        }
    }

    pub async fn write(&self, record: &TranslationRecord) -> Result<(), String> {
        if self.is_duplicate(&record.original).await {
            return Ok(());
        }

        let path = self.get_today_note_path();
        let content = self.generate_content(record);

        if path.exists() {
            let mut existing = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            existing.push_str(&content);
            fs::write(&path, existing).map_err(|e| e.to_string())?;
        } else {
            let date_str = Local::now().format("%Y年%m月%d日").to_string();
            let header = format!("# {}\n\n---\n\n", date_str);
            fs::write(&path, header + &content).map_err(|e| e.to_string())?;
        }
        Ok(())
    }
}
`

### 5.4 历史索引 knowledge_base/history_index.rs

`ust
use std::path::PathBuf;
use std::fs;
use std::collections::HashMap;

#[derive(Debug, Clone, serde::Serialize)]
pub struct HistoryItem {
    pub original: String,
    pub translation: String,
    pub date: String,
    pub time: String,
    pub tags: Vec<String>,
}

pub struct HistoryIndex {
    base_path: PathBuf,
    index: HashMap<String, Vec<HistoryItem>>,
    is_built: bool,
}

impl HistoryIndex {
    pub fn new(base_path: PathBuf) -> Self {
        Self {
            base_path,
            index: HashMap::new(),
            is_built: false,
        }
    }

    pub async fn build_index(&mut self) -> Result<(), String> {
        let mut entries = fs::read_dir(&self.base_path).map_err(|e| e.to_string())?;
        while let Some(Ok(entry)) = entries.next() {
            let path = entry.path();
            if path.extension().and_then(|e| e.to_str()) != Some("md") { continue; }
            let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            let date = path.file_stem().unwrap().to_string_lossy().to_string();
            let items = Self::parse_note(&content, &date);
            self.index.insert(date, items);
        }
        self.is_built = true;
        Ok(())
    }

    pub fn search(&self, query: &str) -> Vec<HistoryItem> {
        let query_lower = query.to_lowercase();
        self.index.values()
            .flatten()
            .filter(|item| item.original.to_lowercase().contains(&query_lower))
            .cloned()
            .collect()
    }

    pub fn get_recent(&self, limit: usize) -> Vec<HistoryItem> {
        let mut all: Vec<HistoryItem> = self.index.values().flatten().cloned().collect();
        all.sort_by(|a, b| b.date.cmp(&a.date));
        all.into_iter().take(limit).collect()
    }

    fn parse_note(content: &str, date: &str) -> Vec<HistoryItem> {
        // 解析 Markdown 笔记文件，提取翻译记录
        // 实现细节...
        vec![]
    }
}
`

### 5.5 窗口管理 window_manager.rs

`ust
use tauri::{Manager, LogicalPosition, LogicalSize, WebviewWindowBuilder};

const POPUP_WIDTH: f64 = 360.0;
const POPUP_HEIGHT: f64 = 300.0;

pub fn show_translation_popup(app: &tauri::AppHandle, x: f64, y: f64) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("popup") {
        window.show().map_err(|e| e.to_string())?;
        return Ok(());
    }

    let window = WebviewWindowBuilder::new(app, "popup", tauri::WebviewUrl::App("popup.html".into()))
        .title("翻译")
        .inner_size(POPUP_WIDTH, POPUP_HEIGHT)
        .position(x, y)
        .decorations(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .visible(false)
        .build()
        .map_err(|e| e.to_string())?;

    window.show().map_err(|e| e.to_string())?;
    Ok(())
}

pub fn hide_translation_popup(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("popup") {
        window.hide().ok();
    }
}

pub fn resize_popup(app: &tauri::AppHandle, width: f64, height: f64) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("popup") {
        window.set_size(LogicalSize::new(width, height)).map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// 获取当前鼠标所在显示器的边界
pub fn get_display_bounds(app: &tauri::AppHandle, x: f64, y: f64) -> (f64, f64, f64, f64) {
    let monitor = app.monitor_from_point(x, y).unwrap_or_else(|| {
        app.primary_monitor().expect("No primary monitor")
    }).expect("No monitor found");

    let pos = monitor.position();
    let size = monitor.size();
    (pos.x as f64, pos.y as f64, size.width as f64, size.height as f64)
}

/// 计算弹窗位置（确保不超出屏幕）
pub fn calculate_popup_position(app: &tauri::AppHandle, mouse_x: f64, mouse_y: f64) -> (f64, f64) {
    let (disp_x, disp_y, disp_w, disp_h) = get_display_bounds(app, mouse_x, mouse_y);

    let mut x = mouse_x + 10.0;
    let mut y = mouse_y + 10.0;

    if x + POPUP_WIDTH > disp_x + disp_w {
        x = mouse_x - POPUP_WIDTH - 10.0;
    }
    if y + POPUP_HEIGHT > disp_y + disp_h {
        y = mouse_y - POPUP_HEIGHT - 10.0;
    }

    x = x.max(disp_x);
    y = y.max(disp_y);

    (x, y)
}
`

### 5.6 系统托盘 	ray.rs

`ust
use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, MouseButton},
    Manager,
};

pub fn create_tray(app: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let settings = MenuItem::with_id(app, "settings", "设置", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&settings, &quit])?;

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "settings" => {
                if let Some(window) = app.get_webview_window("main") {
                    window.show().ok();
                    window.set_focus().ok();
                }
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let MouseButton::Left = event.click_type {
                // 左键点击托盘图标时触发翻译流程
                let app = tray.app_handle();
                // 触发快捷键逻辑...
            }
        })
        .build(app)?;

    Ok(())
}
`

### 5.7 全局快捷键 shortcut.rs

`ust
use tauri::GlobalShortcutManager;

pub fn register_shortcuts(app: &tauri::AppHandle) -> Result<(), String> {
    let shortcut = "CmdOrCtrl+Shift+Q";
    
    app.global_shortcut_manager()
        .register(shortcut, move || {
            // 触发翻译流程
            // 1. 获取选中文本
            // 2. 调用翻译
            // 3. 显示弹窗
        })
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
`

### 5.8 配置管理 config.rs

`ust
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use tauri_plugin_store::StoreExt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub api_key: String,
    pub model: String,
    pub shortcut: String,
    pub auto_save: bool,
    pub obsidian_path: String,
    pub theme: String,  // "dark" | "light" | "system"
    pub max_history: i32,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            model: "qwen-turbo".to_string(),
            shortcut: "CmdOrCtrl+Shift+Q".to_string(),
            auto_save: true,
            obsidian_path: "~/Documents/Obsidian/AI翻译库".to_string(),
            theme: "system".to_string(),
            max_history: 1000,
        }
    }
}

pub fn get_config(app_handle: &tauri::AppHandle) -> AppConfig {
    let store = app_handle.store("config.json").expect("Failed to load store");
    
    AppConfig {
        api_key: store.get("api_key").and_then(|v| v.as_str().map(String::from)).unwrap_or_default(),
        model: store.get("model").and_then(|v| v.as_str().map(String::from)).unwrap_or_else(|| "qwen-turbo".to_string()),
        shortcut: store.get("shortcut").and_then(|v| v.as_str().map(String::from)).unwrap_or_else(|| "CmdOrCtrl+Shift+Q".to_string()),
        auto_save: store.get("auto_save").and_then(|v| v.as_bool()).unwrap_or(true),
        obsidian_path: store.get("obsidian_path").and_then(|v| v.as_str().map(String::from)).unwrap_or_else(|| "~/Documents/Obsidian/AI翻译库".to_string()),
        theme: store.get("theme").and_then(|v| v.as_str().map(String::from)).unwrap_or_else(|| "system".to_string()),
        max_history: store.get("max_history").and_then(|v| v.as_i64()).map(|v| v as i32).unwrap_or(1000),
    }
}

pub fn set_config(app_handle: &tauri::AppHandle, key: &str, value: serde_json::Value) -> Result<(), String> {
    let store = app_handle.store("config.json").expect("Failed to load store");
    store.set(key, value);
    store.save().map_err(|e| e.to_string())?;
    Ok(())
}
`

### 5.9 主题检测 	heme.rs

`ust
#[tauri::command]
pub fn get_system_theme() -> String {
    // Tauri 2 自动跟随系统主题
    // 通过 window.theme() 获取
    "system".to_string()
}

// React 端通过 window.__TAURI_INTERNALS__.theme 获取
// 或使用 @tauri-apps/api 的 window.theme()
`

---

## 6. Tauri Commands 通信设计

### 6.1 命令列表

| 命令名 | 方向 | 描述 |
|--------|------|------|
| 	ranslate | 前端 → 后端 (invoke) | 请求翻译 |
| get_selected_text | 前端 → 后端 (invoke) | 获取选中文本 |
| show_popup | 后端 → 前端 (emit) | 显示弹窗事件 |
| hide_popup | 后端 → 前端 (emit) | 隐藏弹窗事件 |
| search_history | 前端 → 后端 (invoke) | 搜索历史 |
| get_recent_history | 前端 → 后端 (invoke) | 获取最近记录 |
| get_config | 前端 → 后端 (invoke) | 获取配置 |
| set_config | 前端 → 后端 (invoke) | 设置配置 |
| 	heme_changed | 后端 → 前端 (emit) | 主题变化通知 |
| save_translation | 前端 → 后端 (invoke) | 保存翻译到 Obsidian |
| quit | 前端 → 后端 | 退出应用 |

### 6.2 前端调用示例

`	ypescript
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

// 翻译
const result = await invoke<TranslationResult>('translate', { text: 'hello' })

// 获取选中文本
const text = await invoke<string>('get_selected_text')

// 保存翻译
await invoke('save_translation', { record })

// 获取配置
const config = await invoke<AppConfig>('get_config')

// 监听主题变化
await listen('theme_changed', (event) => {
  const theme = event.payload as 'dark' | 'light'
  document.documentElement.setAttribute('data-theme', theme)
})
`

### 6.3 类型声明 	ypes/tauri.ts

`	ypescript
export interface TranslationResult {
  original: string
  translation: string
  phonetic?: string
  part_of_speech?: string
  example?: string
  model: string
}

export interface TranslationRecord {
  id: string
  original: string
  translation: string
  phonetic?: string
  part_of_speech?: string
  example?: string
  timestamp: number
  tags: string[]
}

export interface HistoryItem {
  original: string
  translation: string
  date: string
  time: string
  tags: string[]
}

export interface AppConfig {
  api_key: string
  model: string
  shortcut: string
  auto_save: boolean
  obsidian_path: string
  theme: 'dark' | 'light' | 'system'
  max_history: number
}
`

---

## 7. 安全设计

- **API Key 保护**：存储在 Rust 端 tauri-plugin-store 加密存储，前端不直接访问
- **无 Node 运行时**：Tauri 不使用 Node.js，减少攻击面
- **文件写入权限**：仅写入用户指定的 Obsidian 目录，在 capabilities/default.json 中声明
- **网络请求**：在 Rust 端使用 reqwest 发起 HTTPS 请求
- **CSP**：通过 	auri.conf.json 配置内容安全策略

### 权限配置 src-tauri/capabilities/default.json

`json
{
  "": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default permissions",
  "windows": ["main", "popup"],
  "permissions": [
    "core:default",
    "core:window:allow-show",
    "core:window:allow-hide",
    "core:window:allow-set-size",
    "core:window:allow-set-position",
    "core:window:allow-set-always-on-top",
    "core:window:allow-set-decorations",
    "core:window:allow-set-skip-taskbar",
    "core:tray:default",
    "global-shortcut:allow-register",
    "global-shortcut:allow-unregister",
    "clipboard-manager:allow-read-text",
    "clipboard-manager:allow-write-text",
    "store:default",
    "dialog:default"
  ]
}
`

---

## 8. 配置管理

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| pi_key | string | - | 大模型 API Key（加密存储） |
| model | string | qwen-turbo | 模型选择 |
| shortcut | string | CmdOrCtrl+Shift+Q | 全局快捷键 |
| uto_save | boolean | 	rue | 自动保存到知识库 |
| obsidian_path | string | ~/Documents/Obsidian/AI翻译库 | Obsidian 库路径 |
| 	heme | 'dark' \| 'light' \| 'system' | system | 主题 |
| max_history | number | 1000 | 最大历史记录数（内存索引） |

---

## 9. 打包与发布

`json
// src-tauri/tauri.conf.json
{
  "productName": "划词AI翻译",
  "version": "1.0.0",
  "identifier": "com.example.my-ai-dict",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "划词AI翻译",
        "width": 800,
        "height": 600,
        "visible": false
      }
    ],
    "security": {
      "csp": "default-src 'self'; connect-src 'self' https://dashscope.aliyuncs.com https://api.openai.com"
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/128x128@2x.png", "icons/icon.icns", "icons/icon.ico"]
  }
}
`

构建命令：
`ash
# 开发模式
npm run tauri dev

# 构建发布包
npm run tauri build
# 产物：target/release/bundle/nsis/划词AI翻译_1.0.0_x64-setup.exe
`

---

## 10. React 前端组件设计

### 10.1 Zustand 状态管理

`	ypescript
// stores/translation.ts
import { create } from 'zustand'

interface TranslationState {
  text: string
  result: TranslationResult | null
  isLoading: boolean
  error: string | null
  translate: (text: string) => Promise<void>
  clear: () => void
}

export const useTranslationStore = create<TranslationState>((set) => ({
  text: '',
  result: null,
  isLoading: false,
  error: null,
  translate: async (text: string) => {
    set({ isLoading: true, error: null, text })
    try {
      const result = await invoke<TranslationResult>('translate', { text })
      set({ result, isLoading: false })
    } catch (error) {
      set({ error: error as string, isLoading: false })
    }
  },
  clear: () => set({ text: '', result: null, error: null }),
}))
`

### 10.2 翻译弹窗组件

`	sx
// components/TranslationPopup.tsx
import { useEffect } from 'react'
import { useTranslationStore } from '../stores/translation'
import { useThemeStore } from '../stores/theme'

export function TranslationPopup() {
  const { text, result, isLoading, error } = useTranslationStore()
  const { theme } = useThemeStore()

  if (isLoading) {
    return (
      <div className="popup popup--loading">
        <div className="popup__spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="popup popup--error">
        <div className="popup__error">{error}</div>
      </div>
    )
  }

  if (!result) return null

  const isWord = !text.includes(' ')

  return (
    <div className="popup">
      <div className="popup__original">{text}</div>
      <div className="popup__translation">{result.translation}</div>
      {isWord && result.phonetic && (
        <div className="popup__phonetic">{result.phonetic}</div>
      )}
      {isWord && result.part_of_speech && (
        <div className="popup__pos">{result.part_of_speech}</div>
      )}
      {result.example && (
        <div className="popup__example">{result.example}</div>
      )}
    </div>
  )
}
`

### 10.3 主题 Hook

`	ypescript
// hooks/useTheme.ts
import { useEffect } from 'react'
import { useThemeStore } from '../stores/theme'
import { getCurrentWindow } from '@tauri-apps/api/window'

export function useTheme() {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    const window = getCurrentWindow()
    window.theme().then((t) => {
      setTheme(t ?? 'light')
    })

    const unlisten = window.onThemeChanged(({ payload }) => {
      setTheme(payload)
    })

    return () => { unlisten.then(fn => fn()) }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, setTheme }
}
`

---

## 11. 核心价值总结

| 特性 | 有道词典 | 本产品 |
|------|---------|--------|
| 划词翻译 | ✅ | ✅ |
| **本地知识库** | ❌ | **✅** |
| **自动记录** | ❌ | **✅** |
| **Obsidian 集成** | ❌ | **✅** |
| **暗色主题** | ❌ | **✅** |
| 自定义提示词 | ❌ | ✅ |
| 多模型支持 | ❌ | ✅ |
| **轻量设计** | ❌ | **✅** |
| **Tauri 原生** | ❌ | **✅** |

**核心差异：** 本产品将单次翻译转化为持续积累的知识资产，同时利用 Tauri 2 的轻量和安全性，保持工具的快速和可靠。

---

*最后更新：2026-08-11*





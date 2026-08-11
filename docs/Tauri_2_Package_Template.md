# Tauri 2 æåæ¨¡ææµç¯æå

> ai-popup-translator v1.0.0 | æå¹´æï¼2026-08-11

---

## 1. ç³»ç»çæ¬çæ¬

| å·¥å¨ | ç¬¬æ¬ | ç¼è¨ |
|-------|--------|------|
| Node.js | v22.16.0 | LTS |
| npm | v11.7.0 | é»è®¤åæ¨ |
| Rust | 1.97.1 (stable) | éè¿ rustup |
| Cargo | 1.97.1 | éè¿ rustup |
| Tauri CLI | v2.x | npm å®è£½ |
| OS | Windows 10/11 | MSVC æ GNU |

---

## 2. ç¯å°ä¸å®è£½

### Windows (MSVC - æè¨)

```powershell
# 1. å®è£½ Rust (MSVC)
# ä¸è½½ https://win.rustup.rs/x86_64 è¿è¡ï¼ç¨å½å®è£½
rustup-init.exe -y --default-host x86_64-pc-windows-msvc --default-toolchain stable

# 2. å®è£½ Visual Studio Build Tools (å¿éä¸­ç++è´ä¸)
# ä¸è½½ https://aka.ms/vs/17/release/vs_BuildTools.exe
# éæä¸ Visual C++ build tools å·¥è´è½½

# 3. å®è£½ Node.js
# ä¸è½½ https://nodejs.org/ (LTS)

# 4. å®è£½ä¾èµ
npm install

# 5. æå
npm run tauri build
```

### Windows (GNU/MinGW - å¤ä¸æ¡æ³)

```powershell
# 1. å®è£½ Rust (GNU)
rustup toolchain install stable-x86_64-pc-windows-gnu
rustup default stable-x86_64-pc-windows-gnu

# 2. å®è£½ MSYS2 (æä¾ MinGW å·¥ååº«)
# ä¸è½½ https://github.com/msys2/msys2-installer/releases
# è¿è¡ MSYS2 shellï¼è¿è¡ï¼
pacman -S --noconfirm mingw-w64-x86_64-gcc mingw-w64-x86_64-binutils

# 3. éç½® Cargo ä½ç¨ LLD é¾å¨
# å¨ src-tauri/.cargo/config.toml ä¸æ·å ï¼
# [target.x86_64-pc-windows-gnu]
# linker = "rust-lld.exe"
# rustflags = ["-C", "linker-flavor=ld.lld"]

# 4. å®è£½ä¾èµ & æå
npm install
npm run tauri build
```

### macOS

```bash
# 1. å®è£½ Xcode Command Line Tools
xcode-select --install

# 2. å®è£½ Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 3. å®è£½ Node.js
brew install node

# 4. å®è£½ä¾èµ & æå
npm install
npm run tauri build
```

### Linux

```bash
# 1. å®è£½ä¾è½åºç¨
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev \
  build-essential curl wget libssl-dev \
  libgtk-3-dev libayatana-appindicator3-dev \
  librsvg2-dev patchelf

# 2. å®è£½ Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 3. å®è£½ Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. å®è£½ä¾èµ & æå
npm install
npm run tauri build
```

---

## 3. .env ç¯å°åæ¨¡å¼

éå¨ `src-tauri/` ç½® `.env` ï¼ç¨äºå¼å¨æ¨å¼ä¸ API Keyï¼ï¼

```env
# éè®¯åå¦ (DashScope) - é»è®¤
DASHSCOPE_API_KEY=sk-your-key-here

# OpenAI
OPENAI_API_KEY=sk-your-key-here

# DeepSeek
DEEPSEEK_API_KEY=sk-your-key-here
```

ç£åºæ··å»ºæ¶ï¼Tauri ä¼ `.env` åæäººä¸ºç¯å°åè¯åãAPI Key ä» Rust åç«¯åï¼ä¸ä¼æé«å°åç«¯ã

---

## 4. æ£æ®éç½®è¯´æ

### tauri.conf.json æ ¸å¿å±æ§

| å±æ§ | å¼ºè¯´æ |
|------|--------|
| `identifier` | åºç¨å¨ä¸æ å°ï¼æ¨¡å¼ï¼`com.company.appname` |
| `build.beforeDevCommand` | å¼å¨æ¨å¼æåä»¤ï¼åºç¨ npm/pnpm/yarn |
| `build.beforeBuildCommand` | æååä»¤ |
| `build.frontendDist` | åç«¯æååæ¹åï¼é»è®¤ `../dist` |
| `bundle.targets` | `all`æ `msi`/`nsis`/`upx` |
| `bundle.icon` | å¾çè·å¾ï¼`32x32.png` `128x128.png` `128x128@2x.png` `icon.ico` `icon.icns` |

### éå±è®¾ç½®æ¨¡æ¿

```json
{
  "identifier": "com.cheshiping.ai-popup-translator",
  "productName": "AI Translator",
  "version": "1.0.0",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  }
}
```

---

## 5. å¹è°èæ¿åé¡¹

| ç®¡é¡¹ | è¯´æ |
|--------|------|
| `dist/` / `target/` | éå¨ .gitignore çå |
| `node_modules/` | éå¨ .gitignore çå |
| `.env` | éå¨ .gitignore çå |
| `src-tauri/.cargo/config.toml` | æå¨ç¡®ä¿æ¬ä¸æä¸è¿è¡ |

---

## 6. ä»£ç ç»æ

```
ai-popup-translator/
├── src/                    # React + TypeScript åç«¯
│   ├── components/         # UI ç»ä»¶ (TranslationPopup, SettingsPanel, HistoryPanel)
│   ├── stores/             # Zustand ç¶æç®¡ç (translation, config, history, ui)
│   ├── hooks/              # React Hooks (useTheme)
│   ├── styles/             # CSS æ ·å¼ (globals.css - Design System)
│   ├── types/              # TypeScript ç±»åæ¨¡å
│   ├── App.tsx             # ä¸»ç»ä»¶
│   ├── main.tsx            # å¥å¥¨ç¹æå
│   └── vite-env.d.ts       # Vite ç¯åå«
├── src-tauri/              # Rust åç«¯ (Tauri)
│   ├── src/
│   │   ├── main.rs         # Rust å¥å¥¨ + Tauri Builder
│   │   ├── lib.rs          # æ¨¡å¯¼å
│   │   ├── commands.rs     # Tauri IPC å½ä»¤
│   │   ├── translator.rs   # AI ç¯è¯æå¡ï¨reqwestï©
│   │   ├── obsidian.rs     # Obsidian éæ¢
│   │   ├── tray.rs         # ç³»ç»æ¡ç¢
│   │   ├── window.rs       # çªå£ç®¡ç
│   │   ├── config.rs       # éç½®æ¨¡å + AppConfig
│   │   └── error.rs        # éè¯¯å¤ç (thiserror)
│   ├── .cargo/config.toml  # Rust ç¯åéç½® (LND linker)
│   ├── Cargo.toml          # Rust ä¾èµ
│   ├── tauri.conf.json     # Tauri éç½®
│   ├── build.rs            # Rust æåè„åº
│   └── icons/              # åºç¨å¾ç (32/128/256 .png + .ico + .icns)
├── docs/                   # æ¡ææ
├── index.html              # Vite å¥å¥¨ HTML
├── package.json            # Node ä¾èµ
├── vite.config.ts          # Vite æåä½
├── tsconfig.json           # TypeScript éç½®
└── .gitignore              # Git å¿ç
```

---

## 7. æ¬å®ç»èæ¶

| éæ®µ | èæ¶ |
|------|------|
| `npm install` | ~50s |
| `npm run build` (Vite) | ~5s |
| Rust ç¯åä¸æ¬ (cold) | ~2-5 min |
| Rust ç¯åä¸æ¬ (cached) | ~30-60s |
| Tauri NSIS æå | ~1-2 min |
| **æ»è** | **~5-10 min** |

---

*æ¬æ¡æææåæ¶ï¼2026-08-11*

# Bug ä¿®å¤æ²åææ¡æ

> ai-popup-translator v1.0.0 | æå¹´æï¼2026-08-11

---

## æ»è¿åæ³¨

æ¬æ¡ææè®°å½æç¬¬ä¸æ­¥ïç¬¬äºæ­¥ä¸éæ£å°å°åçææèæ¿®å¤ãæ°¸ä¹åæ æ¡é®ç§ãè¯·æ°¸æ°æä¸ºæä¹¦åæ²¡ææ¶é®ä¸­æ¡ç­ç®çæå°ã

---

## Bug #1: tauri.conf.json æå±æ§ `deb`

### æåå…³å­
`Additional properties are not allowed ('deb' was unexpected)`

### æ æ
`bundle` å±æ§ä¸å…è®¸å `deb` å±æ§ï¼è¯å±æ§äº Linux Debian åºï¼ä¸é Windows æåæ— å…³ã

### ä¿®å¤ä»£ç
```json
// é¤åº bundle æµç "deb" å±æ§
"bundle": {
  "active": true,
  "targets": "all",
  "icon": [...],
  // æ¡é¢ç "deb": { "depends": [] }
}
```

---

## Bug #2: Tauri ç¬èä¸åŒ

### æåå…³å­
`Found version mismatched Tauri packages`

### æ æ
NPM åï¼`@tauri-apps/api`, `@tauri-apps/plugin-*`ï¼ä¸ Rust crateï¼`tauri`, `tauri-plugin-*`ï¼ç¬ä¸åŒã
ä¾å¦ï¼`tauri (v2.1.1) : @tauri-apps/api (v2.11.1)` ä¸è¬ä¸åŒã

### ä¿®å¤ä»£ç
```toml
# Cargo.toml - ä½ç¨éç¬è
tauri = { version = "2", features = ["tray-icon", "image-png"] }
tauri-plugin-store = "2"
tauri-plugin-global-shortcut = "2"
tauri-plugin-clipboard-manager = "2"
tauri-plugin-shell = "2"
tauri-plugin-dialog = "2"
```

```json
// package.json - ç»ä¸ä½ç¨ ^2.0.0
"@tauri-apps/api": "^2.0.0",
"@tauri-apps/plugin-store": "^2.0.0",
"@tauri-apps/plugin-global-shortcut": "^2.0.0",
"@tauri-apps/plugin-clipboard-manager": "^2.0.0",
"@tauri-apps/plugin-shell": "^2.0.0",
"@tauri-apps/plugin-dialog": "^2.0.0"
```

---

## Bug #3: package.json BOM ç¼ç 

### æåå…³å­
`Failed to load PostCSS config: Unexpected token '﻿'`

### æ æ
`package.json` æ¶ä¸¤ `﻿` ï¼UTF-8 BOM ï¼ï¼å¼è Vite è½½ PostCSS éç½®æ JSON è§ææ¯ã

### ä¿®å¤æ¹³³
éå¨ `package.json` ï¼ç¨æ BOM ç¼çæ¹³åï¼å¦
```powershell
$json = @{ ... } | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($path, $json, [System.Text.UTF8Encoding]::new($false))
```

---

## Bug #4: vite.config.ts TypeScript éè¯¯

### æåå…³å­
- `'host' is declared but its value is never read`
- `Cannot find name 'process'`
- `No overload matches this call` (async config)

### æ æ
1. æªä½¿ç¨ç `host` åæ°éã
2. ç¼ºå° `@types/node` æ´æ `process` å±éã
3. `defineConfig` ä½ç¨ `async` å¡æ°æ¼æå®¹ã

### ä¿®å¤ä»£ç
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite'

export default defineConfig((): UserConfig => ({
  plugins: [react()],
  clearScreen: false,
  server: { port: 1420, strictPort: true, host: false },
  envPrefix: ['VITE_', 'TAURI_'],
  build: { target: 'chrome105', minify: 'esbuild', sourcemap: false },
}))
```

å®è£½ `@types/nodeï¼
```bash
npm install --save-dev @types/node
```

---

## Bug #5: tsconfig.node.json composite éè¦æ±‚

### æåå…³å­
`Referenced project must have setting "composite": true`

### æ æ
`tsconfig.json` åé `tsconfig.node.json`ï¼ä½ `tsconfig.node.json` æªè®¾ç½® `composite: true`ã

### ä¿®å¤ä»£ç
```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "noEmit": false,
    "emitDeclarationOnly": true,
    "declaration": true,
    "types": ["node"]
  }
}
```

---

## Bug #6: Rust é¾å¨éè¦æ± (link.exe / dlltool.exe)

### æåå…³å­
- `linker 'link.exe' not found` (MSVC)
- `error calling dlltool 'dlltool.exe': program not found` (GNU)

### æ æ
- **MSVC ç¯å**éè¦ Visual Studio Build Tools æ link.exeï¼
- **GNU ç¯å**éè¦ MSYS2/MinGW æ dlltool.exeã

### ä¿®å¤æ¹³³
**æ¹³³ 1ï¼å®è£½ Visual Studio Build Tools**
```powershell
# ä¸è½½ https://aka.ms/vs/17/release/vs_BuildTools.exe
vs_BuildTools.exe --quiet --add Microsoft.VisualStudio.Workload.VCTools
```

**æ¹³³ 2ï¼ä½ç¨ Rust LLD é¾å¨ï¼ä»£æ link.exeï¼
```toml
# src-tauri/.cargo/config.toml
[target.x86_64-pc-windows-msvc]
linker = "rust-lld.exe"
rustflags = ["-C", "linker-flavor=lld-link"]
```

**æ¹³³ 3ï¼å®è£½ MSYS2 + MinGWï¼GNU ç¯åï¼
```powershell
# å®è£½ MSYS2 åè¿è¡ï¼
pacman -S --noconfirm mingw-w64-x86_64-gcc mingw-w64-x86_64-binutils
```

---

## Bug #7: Windows SDK åºæä¸å­ (kernel32.lib)

### æåå…³å­
`rust-lld: error: could not open 'kernel32.lib': no such file or directory`

### æ æ
Windows SDK åºï¼`kernel32.lib`, `ntdll.lib`, `userenv.lib` çï¼æªå®è£½ã
è¿äºæºäº Windows Kits æ Visual Studioã

### ä¿®å¤æ¹³³
å®è£½ Windows SDK æ Visual Studio Build Toolsï¼åè®®ä½ç¨æ¹³³ 1ï¼VS Build Toolsï¼ã

---

## ç»èæ¶å

| ç¬¬æ¬ | æ°é | ç»èæ¶ |
|-------|------|--------|
| #1 | 1 | ç´æ¡é¢ä¿®æ¹ |
| #2 | 1 | ç¬ç»ä¸ |
| #3 | 1 | BOM é®ç½® |
| #4 | 3 | TypeScript éç½® |
| #5 | 1 | composite è®¾ç½® |
| #6 | 2 | å·¥åé½ç½® |
| #7 | 1 | SDK å®è£½ |
| **å** | **10** | |

---

*æ¬æ¡ææåæ¶ï¼2026-08-11*

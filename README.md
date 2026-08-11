# çåè¯è¯ AI å¨å±ç¯è¯å·¥å¨

> éææåï¼ä¸é¡µå³è½ï¼æå»ºæçä¸ªåºè¯åºåº«ã

ä¸æ¬ Windows å¨å±åºç¨åºï¼åºäº Tauri 2 + React 18 + Rustï¼éè¿å±å±å¿åº¿è§¦åç¯è¯ï¼å°å°æ¯æ¬¡ç¯è¯è½ç»èªå¨ä¿å­å° Obsidian ç¥èºåºåº«ã

## æ ¸å¿åè½

- **å±å±å¿å°ç¯è¯** ãå¨ä»»æåºç¨ä¸éæææï¼æä¸æ¬å¾å³è§¦åç¯è¯
- **AI æºæ§ç¯è¯** ãæ¯æ� OpenAI / éè®¯åå¦ / DeepSeek / Anthropic / Moonshot çå¤ç§ API
- **èªå¨è®°å½å° Obsidian** ãç¯è¯ç»å°æç¨æ¥è®°ï¼ææ°ç´ è½å»ºç«ç¥èºåºåº«
- **ç³»ç»æ¡ç¢é©±ç¨** åè¯å¨åè£ïåè®¾ç½®è®¿é®
- **åå²è®°å½æç´** å¯å¨åºåæç´åè¯¢æ§è®°å½
- **é¢å½©ææ¡** æäº® / æ¼äº® / ç³»ç»æå¦

## ææææ¡æ¶

- æ¡å°ï¼Windows 10/11
- ç¯è¯å»è¿ï¼10MB
- æ´å ç½æ¶ï¼80MB
- å¼å¨æåï¼Tauri + Rust + Vite

## ç¯åå¼å

### ç¯å°ç¯å¢

- Node.js 18+ (æè¨ 20+)
- Rust 1.75+ (éè¿ rustup å®è£½)
- ååº OS ç¯å°åºç¨ï¼VC++ Build Tools / Xcode / GTK3

### å®è£½ä¾èµ

\`\`\`bash
# å¡å»ªä»
git clone https://github.com/CheShiping/ai-popup-translator.git
cd ai-popup-translator

# å®è£½ä¾èµ
npm install

# å¼å¨æ¨¡å¼
npm run tauri dev

# æååè£å
npm run tauri build
\`\`\`

### .env éç½®ïåæ¨¡å¼ï¼ééè¦ï¼

\`\`\`
# å¨ src-tauri/ ç½® .env ï¼ä¸ä¼ æäººåå°ç»åºï¼
DASHSCOPE_API_KEY=sk-xxx          # éè®¯åå¦ API Key
OPENAI_API_KEY=sk-xxx              # OpenAI API Key
DEEPSEEK_API_KEY=sk-xxx            # DeepSeek API Key
\`\`\`

## ä»£ç ç»æ

\`\`\`
ai-popup-translator/
├── src/                    # React åç«¯æºç
│   ├── components/         # UI ç»ä»¶
│   ├── stores/             # Zustand ç¶æç®¡ç
│   ├── hooks/              # React Hooks
│   ├── styles/             # CSS æ ·å¼
│   └── types/              # TypeScript ç±»åæ¨¡å
├── src-tauri/              # Rust åç«¯ï¨Tauriï©
│   ├── src/                # Rust æºçæ¨¡å
│   │   ├── commands.rs     # Tauri IPC å½ä»¤
│   │   ├── translator.rs   # AI ç¯è¯æå¡
│   │   ├── obsidian.rs     # Obsidian éæ¢
│   │   ├── tray.rs         # ç³»ç»æ¡ç¢
│   │   ├── window.rs       # çªå£ç®¡ç
│   │   ├── config.rs       # éç½®ç®¡ç
│   │   └── error.rs        # éè¯¯å¤ç
│   ├── Cargo.toml          # Rust ä¾èµéç½®
│   ├── tauri.conf.json     # Tauri æåä½
│   └── icons/              # åºç¨å¾ç
├── index.html              # åç«¯å¥å¥¨ HTML
├── vite.config.ts          # Vite æåä½
├── tsconfig.json           # TypeScript éç½®
├── package.json            # Node ä¾èµ
└── docs/                   # æ¡ææ
    æ \`\`\`

## æåæ³

Apache License 2.0 ãåè [LICENSE](./LICENSE)ã

---

**æçæï¼CheShiping | 2026**

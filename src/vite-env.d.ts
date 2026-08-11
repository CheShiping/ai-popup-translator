/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Tauri 2 globals
interface Window {
  __TAURI_INTERNALS__?: unknown
}

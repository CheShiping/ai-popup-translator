import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite'

export default defineConfig((): UserConfig => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` / `tauri build`
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: false,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: 'chrome105',
    minify: 'esbuild',
    sourcemap: false,
  },
}))

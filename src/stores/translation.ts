import { create } from 'zustand'
import type { TranslationResult } from '../types'

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
  translate: async (_text: string) => {
    set({ isLoading: true, error: null, text: _text })
    try {
      // In Tauri mode, invoke the Rust command
      if (window.__TAURI_INTERNALS__) {
        const { invoke } = await import('@tauri-apps/api/core')
        const result = await invoke<TranslationResult>('translate', { text: _text })
        set({ result, isLoading: false })
      } else {
        // Web fallback for development
        set({
          isLoading: false,
          error: 'Tauri API not available - running in web mode',
        })
      }
    } catch (error) {
      set({ error: String(error), isLoading: false })
    }
  },
  clear: () => set({ text: '', result: null, error: null }),
}))

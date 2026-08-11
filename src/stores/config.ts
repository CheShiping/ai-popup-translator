import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_CONFIG, type AppConfig, type ProviderKey } from '../types'

interface ConfigState {
  config: AppConfig
  setConfig: (config: Partial<AppConfig>) => void
  setProvider: (provider: ProviderKey) => void
  resetConfig: () => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      setConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),
      setProvider: (provider) =>
        set((state) => ({
          config: { ...state.config, provider: provider as string },
        })),
      resetConfig: () => set({ config: DEFAULT_CONFIG }),
    }),
    {
      name: 'ai-translator-config',
    }
  )
)

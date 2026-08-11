import { create } from 'zustand'

type Theme = 'dark' | 'light' | 'system'
type ViewMode = 'popup' | 'settings' | 'history'

interface UIState {
  theme: Theme
  viewMode: ViewMode
  setTheme: (theme: Theme) => void
  setViewMode: (mode: ViewMode) => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  viewMode: 'popup',
  setTheme: (theme) => set({ theme }),
  setViewMode: (viewMode) => set({ viewMode }),
}))

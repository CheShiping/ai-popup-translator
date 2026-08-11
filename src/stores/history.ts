import { create } from 'zustand'
import type { HistoryEntry } from '../types'

interface HistoryState {
  entries: HistoryEntry[]
  searchQuery: string
  addEntry: (entry: HistoryEntry) => void
  removeEntry: (id: string) => void
  clearHistory: () => void
  setSearchQuery: (query: string) => void
  filteredEntries: () => HistoryEntry[]
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: [],
  searchQuery: '',
  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries].slice(0, 1000),
    })),
  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),
  clearHistory: () => set({ entries: [] }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  filteredEntries: () => {
    const { entries, searchQuery } = get()
    if (!searchQuery) return entries
    const q = searchQuery.toLowerCase()
    return entries.filter(
      (e) =>
        e.original.toLowerCase().includes(q) ||
        e.translation.toLowerCase().includes(q)
    )
  },
}))

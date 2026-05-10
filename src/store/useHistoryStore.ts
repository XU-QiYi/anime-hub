import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface HistoryEntry {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  watchedAt: number
}

interface HistoryStore {
  history: HistoryEntry[]
  addHistory: (entry: Omit<HistoryEntry, 'watchedAt'>) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      addHistory: (entry) => {
        const existing = get().history.filter((h) => h.mal_id !== entry.mal_id)
        set({ history: [{ ...entry, watchedAt: Date.now() }, ...existing] })
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'animehub-history',
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name)
            if (!str) return null
            const data = JSON.parse(str)
            if (data?.state?.history && Array.isArray(data.state.history)) {
              return data
            }
            return null
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value))
          } catch {}
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name)
          } catch {}
        },
      },
    },
  ),
)

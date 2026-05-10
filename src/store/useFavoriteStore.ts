import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteAnime {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  genres: { name: string }[]
  status: 'want' | 'watching' | 'done' | 'dropped'
}

interface FavoriteStore {
  favorites: FavoriteAnime[]
  progress: Record<number, number>
  addFavorite: (anime: Omit<FavoriteAnime, 'status'> & { status?: FavoriteAnime['status'] }) => void
  removeFavorite: (malId: number) => void
  isFavorite: (malId: number) => boolean
  getStatus: (malId: number) => FavoriteAnime['status'] | undefined
  updateStatus: (malId: number, status: FavoriteAnime['status']) => void
  updateProgress: (malId: number, episode: number) => void
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      progress: {},
      addFavorite: (anime) => {
        const current = get().favorites
        if (current.some((a) => a.mal_id === anime.mal_id)) return
        set({ favorites: [...current, { ...anime, status: anime.status || 'watching' }] })
      },
      removeFavorite: (malId) => {
        set((state) => {
          const { [malId]: _, ...rest } = state.progress
          return {
            favorites: state.favorites.filter((a) => a.mal_id !== malId),
            progress: rest,
          }
        })
      },
      isFavorite: (malId) => get().favorites.some((a) => a.mal_id === malId),
      getStatus: (malId) => get().favorites.find((a) => a.mal_id === malId)?.status,
      updateStatus: (malId, status) => {
        set((state) => ({
          favorites: state.favorites.map((a) =>
            a.mal_id === malId ? { ...a, status } : a
          ),
        }))
      },
      updateProgress: (malId, episode) => {
        set((state) => ({
          progress: { ...state.progress, [malId]: episode },
        }))
      },
    }),
    {
      name: 'animehub-favorites',
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name)
            if (!str) return null
            const data = JSON.parse(str)
            if (data?.state?.favorites && Array.isArray(data.state.favorites)) {
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

export type FavoriteStatus = FavoriteAnime['status']

export const STATUS_CONFIG: Record<FavoriteStatus, { label: string; color: string; bg: string }> = {
  want: { label: '想看', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/25' },
  watching: { label: '追番中', color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/15 border-[#8b5cf6]/25' },
  done: { label: '已看完', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/25' },
  dropped: { label: '弃了', color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/25' },
}

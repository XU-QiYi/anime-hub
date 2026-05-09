import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteAnime {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  genres: { name: string }[]
}

interface FavoriteStore {
  favorites: FavoriteAnime[]
  addFavorite: (anime: FavoriteAnime) => void
  removeFavorite: (malId: number) => void
  isFavorite: (malId: number) => boolean
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (anime) => {
        const current = get().favorites
        if (current.some((a) => a.mal_id === anime.mal_id)) return
        set({ favorites: [...current, anime] })
      },
      removeFavorite: (malId) => {
        set({ favorites: get().favorites.filter((a) => a.mal_id !== malId) })
      },
      isFavorite: (malId) => get().favorites.some((a) => a.mal_id === malId),
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

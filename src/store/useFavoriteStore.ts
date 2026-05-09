import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteAnime {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
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
      addFavorite: (anime) =>
        set((state) => {
          if (state.favorites.some((a) => a.mal_id === anime.mal_id)) return state
          return { favorites: [...state.favorites, anime] }
        }),
      removeFavorite: (malId) =>
        set((state) => ({
          favorites: state.favorites.filter((a) => a.mal_id !== malId),
        })),
      isFavorite: (malId) => get().favorites.some((a) => a.mal_id === malId),
    }),
    {
      name: 'animehub-favorites',
    },
  ),
)

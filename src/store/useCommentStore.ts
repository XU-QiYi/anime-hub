import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Comment } from '../lib/commentApi'
import { fetchComments, addComment as apiAdd, updateComment as apiUpdate, deleteComment as apiDelete, toggleLike as apiToggleLike } from '../lib/commentApi'

interface CommentStore {
  comments: Comment[]
  loading: boolean
  currentAnimeId: number | null
  fetchComments: (animeId: number) => Promise<void>
  addComment: (animeId: number, content: string) => Promise<boolean>
  updateComment: (commentId: string, content: string) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  toggleLike: (commentId: string) => Promise<void>
}

export const useCommentStore = create<CommentStore>()((set, get) => ({
  comments: [],
  loading: false,
  currentAnimeId: null,

  fetchComments: async (animeId) => {
    set({ loading: true, currentAnimeId: animeId })
    try {
      const comments = await fetchComments(animeId)
      set({ comments })
      get().unsubscribe()
      get().subscribe(animeId)
    } catch {
      set({ comments: [] })
    } finally {
      set({ loading: false })
    }
  },

  subscribe: (animeId: number) => {
    const channel = supabase
      .channel(`comments:${animeId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'comments',
        filter: `anime_id=eq.${animeId}`,
      }, (payload) => {
        const updated = payload.new as Comment
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === updated.id ? { ...c, likes: updated.likes } : c
          ),
        }))
      })
      .subscribe()

    useCommentStore.setState({ channel })
  },

  unsubscribe: () => {
    const { channel } = get() as any
    if (channel) {
      supabase.removeChannel(channel)
      useCommentStore.setState({ channel: null })
    }
  },

  addComment: async (animeId, content) => {
    try {
      const comment = await apiAdd(animeId, content)
      if (comment) {
        set((state) => ({ comments: [comment, ...state.comments] }))
      }
      return true
    } catch {
      return false
    }
  },

  updateComment: async (commentId, content) => {
    try {
      await apiUpdate(commentId, content)
      set((state) => ({
        comments: state.comments.map((c) =>
          c.id === commentId ? { ...c, content, updated_at: new Date().toISOString() } : c
        ),
      }))
    } catch {
      // noop
    }
  },

  deleteComment: async (commentId) => {
    const prev = get().comments
    set((state) => ({ comments: state.comments.filter((c) => c.id !== commentId) }))
    try {
      await apiDelete(commentId)
    } catch {
      set({ comments: prev })
    }
  },

  toggleLike: async (commentId) => {
    try {
      const { liked, likes } = await apiToggleLike(commentId)
      set((state) => ({
        comments: state.comments.map((c) =>
          c.id === commentId ? { ...c, likes, isLikedByCurrentUser: liked } : c
        ),
      }))
    } catch {
      // noop
    }
  },
}))

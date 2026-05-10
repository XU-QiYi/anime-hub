import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
  id: string
  username: string
  avatar_url: string | null
  bio: string
  created_at: string
}

interface AuthStore {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({
      session,
      user: session?.user ?? null,
      initialized: true,
    })
    if (session?.user) {
      get().fetchProfile()
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
      })
      if (session?.user) {
        get().fetchProfile()
      } else {
        set({ profile: null })
      }
    })
  },

  signUp: async (email, password, username) => {
    set({ loading: true })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
    set({ loading: false })

    if (error) return { error: error.message }

    if (data.user) {
      set({ user: data.user, session: data.session })
      if (data.session) {
        get().fetchProfile()
      }
    }
    return {}
  },

  signIn: async (email, password) => {
    set({ loading: true })
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    set({ loading: false })

    if (error) return { error: error.message }

    set({ user: data.user, session: data.session })
    get().fetchProfile()
    return {}
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, session: null })
  },

  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) set({ profile: data })
  },

  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) return { error: error.message }

    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    }))
    return {}
  },
}))

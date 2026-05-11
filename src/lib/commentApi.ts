import { supabase } from './supabase'

export interface Comment {
  id: string
  user_id: string
  anime_id: number
  content: string
  created_at: string
  updated_at: string
  profiles?: { username: string; avatar_url: string | null }
}

export async function fetchComments(animeId: number): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles:user_id(username, avatar_url)')
    .eq('anime_id', animeId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Comment[]) || []
}

export async function addComment(animeId: number, content: string): Promise<Comment | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('comments')
    .insert({ anime_id: animeId, content, user_id: user.id })
    .select('*, profiles:user_id(username, avatar_url)')
    .single()

  if (error) throw error
  return data as Comment
}

export async function updateComment(commentId: string, content: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)

  if (error) throw error
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
}

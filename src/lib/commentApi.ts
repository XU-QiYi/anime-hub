import { supabase } from './supabase'

export interface Comment {
  id: string
  user_id: string
  anime_id: number
  content: string
  likes: number
  isLikedByCurrentUser: boolean
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

  const comments = (data as Comment[]) || []
  if (comments.length === 0) return comments

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return comments.map((c) => ({ ...c, isLikedByCurrentUser: false }))
  }

  const commentIds = comments.map((c) => c.id)
  const { data: likes } = await supabase
    .from('comment_likes')
    .select('comment_id')
    .eq('user_id', user.id)
    .in('comment_id', commentIds)

  const likedSet = new Set((likes || []).map((l) => l.comment_id))
  return comments.map((c) => ({ ...c, isLikedByCurrentUser: likedSet.has(c.id) }))
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

export async function toggleLike(commentId: string): Promise<{ liked: boolean; likes: number }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('comment_id', commentId)
    .maybeSingle()

  if (existing) {
    await supabase.from('comment_likes').delete().eq('id', existing.id)
    const { data: comment } = await supabase
      .from('comments')
      .select('likes')
      .eq('id', commentId)
      .single()
    const newLikes = Math.max(0, (comment?.likes ?? 1) - 1)
    await supabase.from('comments').update({ likes: newLikes }).eq('id', commentId)
    return { liked: false, likes: newLikes }
  } else {
    await supabase.from('comment_likes').insert({ user_id: user.id, comment_id: commentId })
    const { data: comment } = await supabase
      .from('comments')
      .select('likes')
      .eq('id', commentId)
      .single()
    const newLikes = (comment?.likes ?? 0) + 1
    await supabase.from('comments').update({ likes: newLikes }).eq('id', commentId)
    return { liked: true, likes: newLikes }
  }
}

export async function isLikedByUser(commentId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('comment_id', commentId)
    .maybeSingle()

  return !!data
}

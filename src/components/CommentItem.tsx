import { useState, useRef, useCallback } from 'react'
import type { Comment } from '../lib/commentApi'
import { useAuthStore } from '../store/authStore'
import { useCommentStore } from '../store/useCommentStore'
import { useToast } from './Toast'

interface Props {
  comment: Comment
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const seconds = Math.floor((now - then) / 1000)
  if (seconds < 60) return '刚刚'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}个月前`
  const years = Math.floor(months / 12)
  return `${years}年前`
}

export default function CommentItem({ comment }: Props) {
  const user = useAuthStore((s) => s.user)
  const { updateComment, deleteComment, toggleLike } = useCommentStore()
  const { showToast, toastEl } = useToast()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(comment.content)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const likeLockRef = useRef(false)

  const isOwn = user?.id === comment.user_id
  const username = comment.profiles?.username || '用户'
  const avatarUrl = comment.profiles?.avatar_url
  const initial = username.charAt(0).toUpperCase()

  async function handleSave() {
    if (!draft.trim() || draft === comment.content) {
      setEditing(false)
      return
    }
    setSaving(true)
    await updateComment(comment.id, draft.trim())
    setSaving(false)
    setEditing(false)
  }

  function handleCancel() {
    setDraft(comment.content)
    setEditing(false)
  }

  async function handleDelete() {
    await deleteComment(comment.id)
    setConfirmDelete(false)
  }

  const handleLike = useCallback(async () => {
    if (!user) {
      showToast('请先登录后再点赞')
      return
    }
    if (likeLockRef.current) return
    likeLockRef.current = true
    await toggleLike(comment.id)
    setTimeout(() => { likeLockRef.current = false }, 300)
  }, [user, comment.id, toggleLike, showToast])

  return (
    <>
    <div className="flex gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: '#8b5cf6' }}>
          {initial}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{username}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{timeAgo(comment.created_at)}</span>
          {comment.updated_at !== comment.created_at && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(已编辑)</span>
          )}
        </div>

        {editing ? (
          <div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={2000}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{draft.length}/2000</span>
              <div className="ml-auto flex gap-2">
                <button onClick={handleCancel} className="px-3 py-1 rounded-lg text-xs border transition-colors hover:bg-[var(--bg-tertiary)]" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  取消
                </button>
                <button onClick={handleSave} disabled={saving || !draft.trim()} className="px-3 py-1 rounded-lg text-xs bg-[#8b5cf6] text-white transition-colors hover:bg-[#7c3aed] disabled:opacity-50">
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
            {comment.content}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-xs transition-colors group"
            style={{ color: comment.isLikedByCurrentUser ? undefined : 'var(--text-muted)' }}
          >
            {comment.isLikedByCurrentUser ? (
              <svg className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400 group-hover:text-red-400 group-hover:scale-110 transition-all" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
            <span className={comment.isLikedByCurrentUser ? 'text-red-500' : ''}>{comment.likes}</span>
          </button>

          {isOwn && !editing && (
            <div className="flex items-center gap-3">
              <button onClick={() => setEditing(true)} className="text-xs transition-colors hover:text-[#8b5cf6]" style={{ color: 'var(--text-muted)' }}>
                编辑
              </button>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400">确认删除？</span>
                  <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300 transition-colors">确定</button>
                  <button onClick={() => setConfirmDelete(false)} className="text-xs transition-colors hover:text-[#8b5cf6]" style={{ color: 'var(--text-muted)' }}>取消</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} className="text-xs transition-colors hover:text-red-400" style={{ color: 'var(--text-muted)' }}>
                  删除
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    {toastEl}
    </>
  )
}

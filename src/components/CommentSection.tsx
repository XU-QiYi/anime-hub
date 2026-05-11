import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useCommentStore } from '../store/useCommentStore'
import CommentItem from './CommentItem'

interface Props {
  animeId: number
}

export default function CommentSection({ animeId }: Props) {
  const user = useAuthStore((s) => s.user)
  const { comments, loading, fetchComments, addComment } = useCommentStore()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments(animeId)
  }, [animeId, fetchComments])

  async function handleSubmit() {
    if (!content.trim()) return
    setSubmitting(true)
    const ok = await addComment(animeId, content.trim())
    if (ok) setContent('')
    setSubmitting(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">
        评论
        {comments.length > 0 && <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-muted)' }}>({comments.length})</span>}
      </h3>

      {user ? (
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="说点什么..."
            maxLength={2000}
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none transition-colors focus:border-[#8b5cf6]"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{content.length}/2000 · Ctrl+Enter 发送</span>
            <button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-[#8b5cf6] text-white transition-all hover:bg-[#7c3aed] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '发送中...' : '发表评论'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-6 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>登录后可以发表评论</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-[#8b5cf6] text-white hover:bg-[#7c3aed] transition-all">
            登录
          </Link>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>还没有评论，来抢沙发！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useHistoryStore } from '../store/useHistoryStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}天前`
  const months = Math.floor(days / 30)
  return `${months}个月前`
}

function History() {
  const history = useHistoryStore((s) => s.history)

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold">观看历史</h2>
          {history.length > 0 && (
            <span className="px-2.5 py-0.5 text-xs rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/25">
              {history.length} 部
            </span>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28">
            <svg className="w-20 h-20 mb-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg mb-2" style={{ color: 'var(--text-muted)' }}>还没有观看记录</p>
            <Link to="/" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors text-sm">去首页看看吧 →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((entry: any) => (
              <Link
                key={entry.mal_id}
                to={`/anime/${entry.mal_id}`}
                className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
              >
                <div className="w-16 h-22 flex-shrink-0 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <img src={entry.images?.jpg?.large_image_url || ''} alt={entry.title || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate group-hover:text-[#8b5cf6] transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    {entry.title}
                  </h3>
                  {entry.score != null && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-yellow-400 text-xs font-medium">{entry.score}</span>
                    </div>
                  )}
                  <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{timeAgo(entry.watchedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default History

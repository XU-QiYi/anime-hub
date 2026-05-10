import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavoriteStore, STATUS_CONFIG, type FavoriteStatus } from '../store/useFavoriteStore'
import Navbar from '../components/Navbar'
import AnimeCard from '../components/AnimeCard'
import Footer from '../components/Footer'

const FILTER_OPTIONS: { value: FavoriteStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'want', label: '想看' },
  { value: 'watching', label: '追番中' },
  { value: 'done', label: '已看完' },
  { value: 'dropped', label: '弃了' },
]

function Favorites() {
  const favorites = useFavoriteStore((s) => s.favorites)
  const [filter, setFilter] = useState<FavoriteStatus | 'all'>('all')

  const filtered = filter === 'all' ? favorites : favorites.filter((f) => f.status === filter)

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold">我的追番</h2>
          {favorites.length > 0 && (
            <span className="px-2.5 py-0.5 text-xs rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/25">
              {favorites.length} 部
            </span>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  filter === opt.value
                    ? 'bg-[#8b5cf6] text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                style={filter !== opt.value ? { backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' } : undefined}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28">
            <svg className="w-20 h-20 mb-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-lg mb-2" style={{ color: 'var(--text-muted)' }}>还没有追番哦</p>
            <Link to="/" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors text-sm">去首页看看吧 →</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>该分类下暂无内容</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((anime, index) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={index} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Favorites

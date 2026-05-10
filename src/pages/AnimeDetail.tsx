import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWithRetry } from '../lib/fetchWithRetry'
import { useFavoriteStore, STATUS_CONFIG, type FavoriteStatus } from '../store/useFavoriteStore'
import { useHistoryStore } from '../store/useHistoryStore'
import { useToast } from '../components/Toast'
import Navbar from '../components/Navbar'

interface JikanAnimeDetail {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  genres: { name: string }[]
  synopsis: string | null
  status: string | null
  episodes: number | null
  aired: { string: string } | null
  rating: string | null
  url: string | null
}

const STATUS_OPTIONS: { value: FavoriteStatus; label: string }[] = [
  { value: 'want', label: '想看' },
  { value: 'watching', label: '追番中' },
  { value: 'done', label: '已看完' },
  { value: 'dropped', label: '弃了' },
]

function AnimeDetail() {
  const { id } = useParams<{ id: string }>()
  const [anime, setAnime] = useState<JikanAnimeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [synopsisExpanded, setSynopsisExpanded] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  const addFavorite = useFavoriteStore((s) => s.addFavorite)
  const removeFavorite = useFavoriteStore((s) => s.removeFavorite)
  const isFavorite = useFavoriteStore((s) => s.isFavorite)
  const getStatus = useFavoriteStore((s) => s.getStatus)
  const updateStatus = useFavoriteStore((s) => s.updateStatus)
  const progress = useFavoriteStore((s) => s.progress[Number(id)] || 0)
  const updateProgress = useFavoriteStore((s) => s.updateProgress)
  const addHistory = useHistoryStore((s) => s.addHistory)
  const { showToast, toastEl } = useToast()

  const followed = anime ? isFavorite(anime.mal_id) : false
  const currentStatus = anime ? getStatus(anime.mal_id) : undefined

  function handleAddFavorite(status: FavoriteStatus) {
    if (!anime) return
    addFavorite({ mal_id: anime.mal_id, title: anime.title, images: anime.images, score: anime.score, genres: anime.genres || [], status })
    setShowStatusMenu(false)
    showToast(`已添加到追番列表（${STATUS_CONFIG[status].label}）`)
  }

  function handleRemoveFavorite() {
    if (!anime) return
    removeFavorite(anime.mal_id)
    setShowStatusMenu(false)
    showToast('已取消追番')
  }

  function handleUpdateStatus(status: FavoriteStatus) {
    if (!anime) return
    updateStatus(anime.mal_id, status)
    setShowStatusMenu(false)
    showToast(`状态已更新为${STATUS_CONFIG[status].label}`)
  }

  useEffect(() => {
    setLoading(true); setError(null)
    fetchWithRetry(`/api/anime/${id}`)
      .then((json: any) => { setAnime(json.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [id])

  useEffect(() => {
    if (anime) {
      addHistory({ mal_id: anime.mal_id, title: anime.title, images: anime.images, score: anime.score })
    }
  }, [anime?.mal_id])

  const synopsisLimit = 150
  const needsTruncate = anime?.synopsis && anime.synopsis.length > synopsisLimit

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      {anime && (
        <div className="relative h-64 sm:h-80">
          <img src={anime.images.jpg.large_image_url} alt="" className="w-full h-full object-cover opacity-20 blur-sm scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/60 via-[var(--bg-primary)]/80 to-[var(--bg-primary)]" />
        </div>
      )}
      <div className="px-6 -mt-32 max-w-5xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 hover:text-[#8b5cf6] transition-colors mb-6" style={{ color: 'var(--text-muted)' }}>
          ← 返回首页
        </Link>
        {loading && <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" /></div>}
        {error && <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}><p>加载失败: {error}</p></div>}
        {anime && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 flex-shrink-0">
              <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/10" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-4">{anime.title}</h1>
              <div className="flex items-center gap-4 mb-5 text-sm" style={{ color: 'var(--text-muted)' }}>
                {anime.score != null && <span className="flex items-center gap-1 text-yellow-400 font-medium">★ {anime.score}</span>}
                {anime.episodes != null && <span>{anime.episodes} 集</span>}
                {anime.status && <span>{anime.status}</span>}
              </div>
              {anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {anime.genres.map((g) => (
                    <span key={g.name} className="px-3 py-1 text-xs rounded-full bg-[#8b5cf6]/15 text-[#8b5cf6] border border-[#8b5cf6]/25">{g.name}</span>
                  ))}
                </div>
              )}

              {/* Watch Progress */}
              {followed && anime.episodes && anime.episodes > 0 && (
                <div className="mb-5 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>观看进度</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>第 {progress} 集 / 共 {anime.episodes} 集</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="h-full bg-[#8b5cf6] rounded-full transition-all" style={{ width: `${(progress / anime.episodes) * 100}%` }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateProgress(anime.mal_id, Math.max(0, progress - 1))} className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm hover:bg-[var(--bg-tertiary)] transition-colors" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>-</button>
                    <input type="number" min={0} max={anime.episodes} value={progress} onChange={(e) => updateProgress(anime.mal_id, Math.min(anime.episodes!, Math.max(0, parseInt(e.target.value) || 0)))} className="w-16 h-8 rounded-lg border text-center text-sm outline-none" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} />
                    <button onClick={() => updateProgress(anime.mal_id, Math.min(anime.episodes!, progress + 1))} className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm hover:bg-[var(--bg-tertiary)] transition-colors" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>+</button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-3 mb-6 relative">
                {followed ? (
                  <div className="relative">
                    <button onClick={() => setShowStatusMenu(!showStatusMenu)} className={`px-6 py-2.5 rounded-xl text-sm font-medium border transition-all ${STATUS_CONFIG[currentStatus || 'watching'].bg} ${STATUS_CONFIG[currentStatus || 'watching'].color}`}>
                      {STATUS_CONFIG[currentStatus || 'watching'].label} ▾
                    </button>
                    {showStatusMenu && (
                      <div className="absolute top-full left-0 mt-2 py-1 rounded-xl border shadow-xl z-30 min-w-[120px]" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                        {STATUS_OPTIONS.map((opt) => (
                          <button key={opt.value} onClick={() => handleUpdateStatus(opt.value)} className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-tertiary)] transition-colors" style={{ color: currentStatus === opt.value ? '#8b5cf6' : 'var(--text-secondary)' }}>
                            {STATUS_CONFIG[opt.value].label}
                          </button>
                        ))}
                        <div className="border-t my-1" style={{ borderColor: 'var(--border-color)' }} />
                        <button onClick={handleRemoveFavorite} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          取消追番
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <button onClick={() => setShowStatusMenu(!showStatusMenu)} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-[#8b5cf6] text-white hover:bg-[#7c3aed] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
                      追番 ▾
                    </button>
                    {showStatusMenu && (
                      <div className="absolute top-full left-0 mt-2 py-1 rounded-xl border shadow-xl z-30 min-w-[120px]" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                        {STATUS_OPTIONS.map((opt) => (
                          <button key={opt.value} onClick={() => handleAddFavorite(opt.value)} className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--bg-tertiary)] transition-colors" style={{ color: 'var(--text-secondary)' }}>
                            {STATUS_CONFIG[opt.value].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <Link to={`/player/${anime.mal_id}`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8b5cf6] text-white text-sm font-medium hover:bg-[#7c3aed] hover:shadow-[0_0_24px_rgba(139,92,246,0.4)] transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  开始播放
                </Link>
              </div>
              {anime.rating && <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{anime.rating}</p>}
              {anime.synopsis && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">简介</h3>
                  <p className="leading-relaxed text-sm" style={{ color: 'var(--text-muted)' }}>
                    {needsTruncate && !synopsisExpanded ? anime.synopsis.slice(0, synopsisLimit) + '...' : anime.synopsis}
                  </p>
                  {needsTruncate && (
                    <button onClick={() => setSynopsisExpanded(!synopsisExpanded)} className="text-[#8b5cf6] hover:text-[#a78bfa] text-sm mt-2 transition-colors">
                      {synopsisExpanded ? '收起' : '展开全部'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {toastEl}
    </div>
  )
}

export default AnimeDetail

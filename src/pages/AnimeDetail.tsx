import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWithRetry } from '../lib/fetchWithRetry'
import { useFavoriteStore } from '../store/useFavoriteStore'
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
}

function AnimeDetail() {
  const { id } = useParams<{ id: string }>()
  const [anime, setAnime] = useState<JikanAnimeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [synopsisExpanded, setSynopsisExpanded] = useState(false)
  const addFavorite = useFavoriteStore((s) => s.addFavorite)
  const removeFavorite = useFavoriteStore((s) => s.removeFavorite)
  const isFavorite = useFavoriteStore((s) => s.isFavorite)
  const followed = anime ? isFavorite(anime.mal_id) : false
  const { showToast, toastEl } = useToast()

  function handleToggleFavorite() {
    if (!anime) return
    if (followed) {
      removeFavorite(anime.mal_id)
      showToast('已取消追番')
    } else {
      addFavorite({ mal_id: anime.mal_id, title: anime.title, images: anime.images, score: anime.score, genres: anime.genres || [] })
      showToast('已添加到追番列表')
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchWithRetry(`/api/anime/${id}`)
      .then((json: any) => { setAnime(json.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [id])

  const synopsisLimit = 150
  const needsTruncate = anime?.synopsis && anime.synopsis.length > synopsisLimit

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white page-enter">
      <Navbar />

      {/* Hero Background */}
      {anime && (
        <div className="relative h-64 sm:h-80">
          <img
            src={anime.images.jpg.large_image_url}
            alt=""
            className="w-full h-full object-cover opacity-20 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>
      )}

      <div className="px-6 -mt-32 max-w-5xl mx-auto relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#a78bfa] transition-colors mb-6"
        >
          ← 返回首页
        </Link>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <div className="text-center py-16 text-gray-500"><p>加载失败: {error}</p></div>}

        {anime && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-64 flex-shrink-0">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className="w-full rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-4 text-white">{anime.title}</h1>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-5 text-sm text-gray-400">
                {anime.score != null && (
                  <span className="flex items-center gap-1 text-yellow-400 font-medium">
                    ★ {anime.score}
                  </span>
                )}
                {anime.episodes != null && <span>{anime.episodes} 集</span>}
                {anime.status && <span>{anime.status}</span>}
              </div>

              {/* Genres */}
              {anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {anime.genres.map((g) => (
                    <span
                      key={g.name}
                      className="px-3 py-1 text-xs rounded-full bg-[#8b5cf6]/15 text-[#a78bfa] border border-[#8b5cf6]/25"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleToggleFavorite}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    followed
                      ? 'bg-white/10 text-gray-400 hover:bg-white/15 hover:text-white border border-white/10'
                      : 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  }`}
                >
                  {followed ? '已追番' : '追番'}
                </button>
                <Link
                  to={`/player/${anime.mal_id}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8b5cf6] text-white text-sm font-medium hover:bg-[#7c3aed] hover:shadow-[0_0_24px_rgba(139,92,246,0.4)] transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  开始播放
                </Link>
              </div>

              {anime.rating && <p className="text-sm text-gray-500 mb-4">{anime.rating}</p>}

              {/* Synopsis */}
              {anime.synopsis && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">简介</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {needsTruncate && !synopsisExpanded
                      ? anime.synopsis.slice(0, synopsisLimit) + '...'
                      : anime.synopsis}
                  </p>
                  {needsTruncate && (
                    <button
                      onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                      className="text-[#8b5cf6] hover:text-[#a78bfa] text-sm mt-2 transition-colors"
                    >
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

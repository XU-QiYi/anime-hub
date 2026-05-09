import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWithRetry } from '../lib/fetchWithRetry'
import { useFavoriteStore } from '../store/useFavoriteStore'
import { useToast } from '../components/Toast'

interface JikanAnimeDetail {
  mal_id: number
  title: string
  images: {
    jpg: {
      large_image_url: string
    }
  }
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
      addFavorite({
        mal_id: anime.mal_id,
        title: anime.title,
        images: anime.images,
        score: anime.score,
      })
      showToast('已添加到追番列表')
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchWithRetry(`/api/anime/${id}`)
      .then((json: any) => {
        setAnime(json.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="text-2xl font-bold text-[#8b5cf6]">
          AnimeHub
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            首页
          </Link>
          <Link
            to="/favorites"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            追番
          </Link>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="搜索动漫..."
              className="w-56 pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 transition-all"
            />
          </div>
        </div>
      </nav>

      <div className="px-6 py-8 max-w-5xl mx-auto">
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

        {error && (
          <div className="text-center py-16 text-gray-500">
            <p>加载失败: {error}</p>
          </div>
        )}

        {anime && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-72 flex-shrink-0">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold flex-1 min-w-0 truncate">
                  {anime.title}
                </h1>
                <button
                  onClick={handleToggleFavorite}
                  className={`flex-shrink-0 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    followed
                      ? 'bg-white/10 text-gray-400 hover:bg-white/15 hover:text-white border border-white/10'
                      : 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]'
                  }`}
                >
                  {followed ? '已追番' : '追番'}
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                {anime.score != null && (
                  <span className="flex items-center gap-1 text-yellow-400 font-medium">
                    ★ {anime.score}
                  </span>
                )}
                {anime.episodes != null && (
                  <span>{anime.episodes} 集</span>
                )}
                {anime.status && <span>{anime.status}</span>}
              </div>

              {anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {anime.genres.map((g) => (
                    <span
                      key={g.name}
                      className="px-3 py-1 text-xs rounded-full bg-[#8b5cf6]/20 text-[#a78bfa] border border-[#8b5cf6]/30"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {anime.rating && (
                <p className="text-sm text-gray-500 mb-4">{anime.rating}</p>
              )}

              {anime.synopsis && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">简介</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {anime.synopsis}
                  </p>
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

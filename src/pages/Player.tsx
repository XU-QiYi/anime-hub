import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWithRetry } from '../lib/fetchWithRetry'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface JikanAnimeDetail {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  synopsis: string | null
  status: string | null
  episodes: number | null
}

function Player() {
  const { id } = useParams<{ id: string }>()
  const [anime, setAnime] = useState<JikanAnimeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchWithRetry(`/api/anime/${id}`)
      .then((json: any) => { setAnime(json.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [id])

  function handleGoBilibili() {
    if (!anime) return
    window.open(`https://search.bilibili.com/all?keyword=${encodeURIComponent(anime.title)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white page-enter">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && <div className="text-center py-16 text-gray-500"><p>加载失败: {error}</p></div>}

        {anime && (
          <>
            {/* Video Area */}
            <div className="relative w-full aspect-video bg-[#111116] rounded-2xl overflow-hidden mb-8 flex flex-col items-center justify-center gap-6 ring-1 ring-white/5">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/50" />
              <p className="text-gray-400 text-lg relative z-10">本作品可在B站观看，即将跳转...</p>
              <button
                onClick={handleGoBilibili}
                className="relative z-10 px-8 py-3 rounded-xl bg-[#8b5cf6] text-white font-medium hover:bg-[#7c3aed] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] transition-all duration-300"
              >
                前往B站观看
              </button>
            </div>

            {/* Info */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-40 flex-shrink-0">
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-full rounded-xl shadow-lg ring-1 ring-white/10"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold mb-3 text-white">{anime.title}</h1>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  {anime.score != null && (
                    <span className="flex items-center gap-1 text-yellow-400 font-medium">★ {anime.score}</span>
                  )}
                  {anime.episodes != null && <span>{anime.episodes} 集</span>}
                  {anime.status && <span>{anime.status}</span>}
                </div>
                {anime.synopsis && (
                  <p className="text-gray-400 leading-relaxed text-sm">{anime.synopsis}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Player

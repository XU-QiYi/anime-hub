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
  url: string | null
}

const PLATFORMS = [
  { name: 'B站', color: '#fb7299', buildUrl: (t: string) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(t)}` },
  { name: '爱奇艺', color: '#00be06', buildUrl: (t: string) => `https://www.iqiyi.com/search/${encodeURIComponent(t)}` },
  { name: '腾讯视频', color: '#ff6a00', buildUrl: (t: string) => `https://v.qq.com/x/search/?q=${encodeURIComponent(t)}` },
  { name: '优酷', color: '#1ebaff', buildUrl: (t: string) => `https://so.youku.com/search_video/${encodeURIComponent(t)}` },
]

function Player() {
  const { id } = useParams<{ id: string }>()
  const [anime, setAnime] = useState<JikanAnimeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true); setError(null)
    fetchWithRetry(`/api/anime/${id}`)
      .then((json: any) => { setAnime(json.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [id])

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading && <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" /></div>}
        {error && <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}><p>加载失败: {error}</p></div>}
        {anime && (
          <>
            {/* Platform Buttons */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 flex flex-col items-center justify-center gap-6 ring-1" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)]/50" />
              <p className="text-lg relative z-10" style={{ color: 'var(--text-muted)' }}>选择平台观看「{anime.title}」</p>
              <div className="relative z-10 grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 px-4">
                {PLATFORMS.map((p) => (
                  <button key={p.name} onClick={() => window.open(p.buildUrl(anime.title), '_blank')} className="px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:scale-105" style={{ backgroundColor: p.color }}>
                    {p.name}
                  </button>
                ))}
                {anime.url && (
                  <button onClick={() => window.open(anime.url!, '_blank')} className="px-6 py-3 rounded-xl bg-[#2e51a2] text-white font-medium transition-all hover:shadow-lg hover:scale-105">
                    MyAnimeList
                  </button>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-40 flex-shrink-0">
                <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full rounded-xl shadow-lg ring-1 ring-white/10" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold mb-3">{anime.title}</h1>
                <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {anime.score != null && <span className="flex items-center gap-1 text-yellow-400 font-medium">★ {anime.score}</span>}
                  {anime.episodes != null && <span>{anime.episodes} 集</span>}
                  {anime.status && <span>{anime.status}</span>}
                </div>
                {anime.synopsis && <p className="leading-relaxed text-sm" style={{ color: 'var(--text-muted)' }}>{anime.synopsis}</p>}
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

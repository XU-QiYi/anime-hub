import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface JikanAnime {
  mal_id: number
  title: string
  images: {
    jpg: {
      large_image_url: string
    }
  }
  score: number | null
  genres: { name: string }[]
}

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [animeList, setAnimeList] = useState<JikanAnime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://api.jikan.moe/v4/top/anime?limit=8')
      .then((res) => {
        if (!res.ok) throw new Error(`API 请求失败: ${res.status}`)
        return res.json()
      })
      .then((json) => {
        setAnimeList(json.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="text-2xl font-bold text-[#8b5cf6]">
          AnimeHub
        </Link>
        <div className="flex items-center gap-3">
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-56 pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 transition-all"
            />
          </div>
        </div>
      </nav>

      {/* Banner */}
      <section className="mx-6 mt-4 rounded-2xl overflow-hidden">
        <div className="relative h-72 bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#6d28d9] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">热门番剧推荐</h2>
            <p className="text-white/70 text-lg">发现更多精彩动漫内容</p>
          </div>
          <div className="absolute inset-0 bg-[#0a0a0a]/20" />
        </div>
      </section>

      {/* Hot Recommendations */}
      <section className="px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">热门推荐</h2>

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

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {animeList.slice(0, 8).map((anime) => (
              <Link
                key={anime.mal_id}
                to={`/anime/${anime.mal_id}`}
                className="group rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-[#8b5cf6]/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] transition-all duration-300 hover:scale-[1.03]"
              >
                <div className="aspect-[3/4] bg-gray-800 overflow-hidden">
                  <img
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-200 truncate mb-2 group-hover:text-[#a78bfa] transition-colors">
                    {anime.title}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-yellow-400 text-sm font-medium">
                      {anime.score ?? '暂无'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default App

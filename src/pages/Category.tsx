import { useEffect, useState } from 'react'
import { fetchWithRetry } from '../lib/fetchWithRetry'
import Navbar from '../components/Navbar'
import AnimeCard from '../components/AnimeCard'
import Footer from '../components/Footer'

interface JikanAnime {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  genres: { name: string }[]
}

const GENRES = [
  { label: '全部', id: null },
  { label: '热血', id: 27 },
  { label: '恋爱', id: 22 },
  { label: '喜剧', id: 4 },
  { label: '悬疑', id: 7 },
  { label: '科幻', id: 24 },
  { label: '奇幻', id: 10 },
  { label: '冒险', id: 2 },
  { label: '日常', id: 36 },
]

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-[#141418]">
          <div className="aspect-[3/4] animate-skeleton" />
          <div className="p-4 space-y-3">
            <div className="h-4 animate-skeleton rounded w-3/4" />
            <div className="h-3 animate-skeleton rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Category() {
  const [activeGenre, setActiveGenre] = useState<number | null>(null)
  const [animeList, setAnimeList] = useState<JikanAnime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const url = activeGenre === null
      ? '/api/top/anime?limit=20'
      : `/api/anime?genres=${activeGenre}&limit=20`
    fetchWithRetry(url)
      .then((json: any) => { setAnimeList(json.data); setLoading(false) })
      .catch(() => { setAnimeList([]); setLoading(false) })
  }, [activeGenre])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white page-enter">
      <Navbar />

      <div className="px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8">分类浏览</h2>

        {/* Genre Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {GENRES.map((g) => (
            <button
              key={g.label}
              onClick={() => setActiveGenre(g.id)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeGenre === g.id
                  ? 'bg-[#8b5cf6] text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]'
                  : 'bg-[#141418] text-gray-400 hover:text-white hover:bg-[#1a1a20] border border-white/5'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {loading && <SkeletonCards />}

        {!loading && animeList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg">该分类暂无数据</p>
          </div>
        )}

        {!loading && animeList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {animeList.map((anime, index) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={index} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Category

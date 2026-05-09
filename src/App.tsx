import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchWithRetry } from './lib/fetchWithRetry'
import Navbar from './components/Navbar'
import AnimeCard from './components/AnimeCard'
import Footer from './components/Footer'

interface JikanAnime {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  genres: { name: string }[]
}

function Banner({ items }: { items: JikanAnime[] }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 5000)
  }, [items.length])

  useEffect(() => {
    if (items.length === 0) return
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [items.length, startTimer])

  function pause() { if (timerRef.current) clearInterval(timerRef.current) }
  function resume() { pause(); startTimer() }
  function goTo(i: number) { setCurrent(i); resume() }

  if (items.length === 0) {
    return (
      <section className="mx-6 mt-4 rounded-2xl overflow-hidden">
        <div className="relative h-72 bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#6d28d9] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">热门番剧推荐</h2>
            <p className="text-white/70 text-lg">发现更多精彩动漫内容</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="mx-6 mt-4 rounded-2xl overflow-hidden relative group"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="relative h-72 sm:h-80 md:h-[28rem]">
        {items.map((anime, i) => (
          <div
            key={anime.mal_id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {items[current].title}
          </h2>
          {items[current].score != null && (
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-yellow-400 font-medium text-lg">{items[current].score}</span>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-[#8b5cf6] w-7' : 'bg-white/40 hover:bg-white/60 w-2'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
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

function App() {
  const [animeList, setAnimeList] = useState<JikanAnime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWithRetry('/api/top/anime?limit=8')
      .then((json: any) => { setAnimeList(json.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white page-enter">
      <Navbar />
      <Banner items={animeList.slice(0, 3)} />

      <section className="px-6 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">热门推荐</h2>
        {loading && <SkeletonCards />}
        {error && <div className="text-center py-16 text-gray-500"><p>加载失败: {error}</p></div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {animeList.slice(0, 8).map((anime, index) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={index} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default App

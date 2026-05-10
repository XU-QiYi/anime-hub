import { useEffect, useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

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

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    pause()
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        setCurrent((prev) => (prev + 1) % items.length)
      } else {
        setCurrent((prev) => (prev - 1 + items.length) % items.length)
      }
    }
    resume()
  }

  if (items.length === 0) {
    return (
      <section className="mx-4 sm:mx-6 mt-4 rounded-2xl overflow-hidden">
        <div className="relative h-48 sm:h-72 bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#6d28d9] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">热门番剧推荐</h2>
            <p className="text-white/70 text-lg">发现更多精彩动漫内容</p>
          </div>
        </div>
      </section>
    )
  }

  return (
      <section className="mx-4 sm:mx-6 mt-4 rounded-2xl overflow-hidden relative group touch-pan-y" onMouseEnter={pause} onMouseLeave={resume} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="relative h-72 sm:h-80 md:h-[28rem]">
        {items.map((anime, i) => (
          <div key={anime.mal_id} className="absolute inset-0 transition-opacity duration-700 ease-in-out" style={{ opacity: i === current ? 1 : 0 }}>
            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{items[current].title}</h2>
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
          <button key={i} onClick={() => goTo(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-[#8b5cf6] w-7' : 'bg-white/40 hover:bg-white/60 w-2'}`} />
        ))}
      </div>
    </section>
  )
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
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

const PAGE_SIZE = 8

function App() {
  const navigate = useNavigate()
  const [animeList, setAnimeList] = useState<JikanAnime[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchWithRetry(`/api/top/anime?limit=${PAGE_SIZE}&page=1`)
      .then((json: any) => { setAnimeList(json.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const json: any = await fetchWithRetry(`/api/top/anime?limit=${PAGE_SIZE}&page=${nextPage}`)
      if (json.data.length === 0) {
        setHasMore(false)
      } else {
        setAnimeList((prev) => [...prev, ...json.data])
        setPage(nextPage)
        if (json.data.length < PAGE_SIZE) setHasMore(false)
      }
    } catch {}
    setLoadingMore(false)
  }, [page, loadingMore, hasMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      {/* Mobile search bar */}
      <div className="md:hidden px-4 mt-3 flex items-center gap-3">
        <div onClick={() => navigate('/search')} className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>搜索动漫...</span>
        </div>
        <Link to="/schedule" className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </Link>
      </div>
      <Banner items={animeList.slice(0, 3)} />
      <section className="px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>热门推荐</h2>
        {loading && <SkeletonCards />}
        {error && <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}><p>加载失败: {error}</p></div>}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {animeList.map((anime, index) => (
              <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} index={index % PAGE_SIZE} />
            ))}
          </div>
        )}
        <div ref={sentinelRef} className="py-8 text-center">
          {loadingMore && <p style={{ color: 'var(--text-muted)' }}>加载中...</p>}
          {!hasMore && !loading && animeList.length > 0 && <p style={{ color: 'var(--text-muted)' }}>没有更多了</p>}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default App

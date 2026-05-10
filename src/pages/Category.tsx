import { useEffect, useState, useRef, useCallback } from 'react'
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

const PAGE_SIZE = 20

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
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

function Category() {
  const [activeGenre, setActiveGenre] = useState<number | null>(null)
  const [animeList, setAnimeList] = useState<JikanAnime[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const prevGenreRef = useRef<number | null>(null)

  useEffect(() => {
    if (prevGenreRef.current !== activeGenre) {
      prevGenreRef.current = activeGenre
      setPage(1)
      setHasMore(true)
      setLoading(true)
      setAnimeList([])
      const url = activeGenre === null
        ? `/api/top/anime?limit=${PAGE_SIZE}&page=1`
        : `/api/anime?genres=${activeGenre}&limit=${PAGE_SIZE}&page=1`
      fetchWithRetry(url)
        .then((json: any) => { setAnimeList(json.data); setLoading(false) })
        .catch(() => { setAnimeList([]); setLoading(false) })
    }
  }, [activeGenre])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const url = activeGenre === null
        ? `/api/top/anime?limit=${PAGE_SIZE}&page=${nextPage}`
        : `/api/anime?genres=${activeGenre}&limit=${PAGE_SIZE}&page=${nextPage}`
      const json: any = await fetchWithRetry(url)
      if (json.data.length === 0) {
        setHasMore(false)
      } else {
        setAnimeList((prev) => [...prev, ...json.data])
        setPage(nextPage)
        if (json.data.length < PAGE_SIZE) setHasMore(false)
      }
    } catch {}
    setLoadingMore(false)
  }, [page, activeGenre, loadingMore, hasMore])

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
      <div className="px-6 py-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">分类浏览</h2>
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {GENRES.map((g) => (
            <button key={g.label} onClick={() => setActiveGenre(g.id)} className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeGenre === g.id ? 'bg-[#8b5cf6] text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`} style={activeGenre !== g.id ? { backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' } : undefined}>
              {g.label}
            </button>
          ))}
        </div>
        {loading && <CategorySkeleton />}
        {!loading && animeList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>该分类暂无数据</p>
          </div>
        )}
        {!loading && animeList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {animeList.map((anime, index) => (
              <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} index={index % PAGE_SIZE} />
            ))}
          </div>
        )}
        <div ref={sentinelRef} className="py-8 text-center">
          {loadingMore && <p style={{ color: 'var(--text-muted)' }}>加载中...</p>}
          {!hasMore && !loading && animeList.length > 0 && <p style={{ color: 'var(--text-muted)' }}>没有更多了</p>}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Category

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
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

function SearchSkeleton() {
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

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [inputValue, setInputValue] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [animeList, setAnimeList] = useState<JikanAnime[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => { setInputValue(initialQuery); setQuery(initialQuery) }, [initialQuery])

  useEffect(() => {
    setLoading(true)
    setError(null)
    const url = query.trim()
      ? `/api/anime?q=${encodeURIComponent(query.trim())}&limit=20`
      : '/api/top/anime?limit=20'
    fetchWithRetry(url)
      .then((json: any) => { setAnimeList(json.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [query])

  function handleSearch() {
    const q = inputValue.trim()
    setHasSearched(true)
    if (q) setSearchParams({ q }); else setSearchParams({})
    setQuery(inputValue)
  }

  function handleInputChange(value: string) {
    setInputValue(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setHasSearched(true)
      const q = value.trim()
      if (q) setSearchParams({ q }); else setSearchParams({})
      setQuery(value)
    }, 500)
  }

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <section className="px-6 pt-12 pb-8 text-center">
        <h2 className="text-3xl font-bold mb-8">
          {query ? `「${query}」的搜索结果` : '搜索动漫'}
        </h2>
        <div className="max-w-xl mx-auto relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="输入动漫名称搜索..."
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-24 py-4 rounded-2xl border text-base outline-none focus:border-[#8b5cf6]/60 focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--input-text)', borderColor: 'var(--border-color)' }}
          />
          <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-sm font-medium text-white transition-colors">
            搜索
          </button>
        </div>
        {!query && <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>未输入关键词，显示热门动漫</p>}
      </section>
      <section className="px-6 pb-12">
        {loading && <SearchSkeleton />}
        {error && <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}><p>加载失败: {error}</p></div>}
        {!loading && !error && animeList.length === 0 && hasSearched && (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}><p>没有找到相关结果</p></div>
        )}
        {!loading && !error && animeList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {animeList.map((anime, index) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={index} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}

export default Search

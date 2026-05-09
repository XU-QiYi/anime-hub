import { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchWithRetry } from '../lib/fetchWithRetry'

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

function AnimeCard({ anime }: { anime: JikanAnime }) {
  return (
    <Link
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

  useEffect(() => {
    setInputValue(initialQuery)
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    setLoading(true)
    setError(null)

    const url = query.trim()
      ? `/api/anime?q=${encodeURIComponent(query.trim())}&limit=20`
      : '/api/top/anime?limit=20'

    fetchWithRetry(url)
      .then((json: any) => {
        setAnimeList(json.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [query])

  function handleSearch() {
    const q = inputValue.trim()
    setHasSearched(true)
    if (q) {
      setSearchParams({ q })
    } else {
      setSearchParams({})
    }
    setQuery(inputValue)
  }

  function handleInputChange(value: string) {
    setInputValue(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setHasSearched(true)
      const q = value.trim()
      if (q) {
        setSearchParams({ q })
      } else {
        setSearchParams({})
      }
      setQuery(value)
    }, 500)
  }

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
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-56 pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 transition-all"
            />
          </div>
        </div>
      </nav>

      {/* Search Hero */}
      <section className="px-6 pt-12 pb-8 text-center">
        <h2 className="text-3xl font-bold mb-6">
          {query ? `「${query}」的搜索结果` : '搜索动漫'}
        </h2>
        <div className="max-w-xl mx-auto relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            placeholder="输入动漫名称搜索..."
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/10 text-base text-gray-200 placeholder-gray-500 outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 transition-all"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-sm font-medium transition-colors"
          >
            搜索
          </button>
        </div>
        {!query && (
          <p className="text-gray-500 text-sm mt-4">未输入关键词，显示热门动漫</p>
        )}
      </section>

      {/* Results */}
      <section className="px-6 pb-12">
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

        {!loading && !error && animeList.length === 0 && hasSearched && (
          <div className="text-center py-16 text-gray-500">
            <p>没有找到相关结果</p>
          </div>
        )}

        {!loading && !error && animeList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {animeList.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Search

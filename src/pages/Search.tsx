import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { fetchWithRetry } from '../lib/fetchWithRetry'
import AnimeCard from '../components/AnimeCard'
import Footer from '../components/Footer'

interface JikanAnime {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  genres: { name: string }[]
}

const HOT_KEYWORDS = ['鬼灭之刃', '进击的巨人', '咒术回战', '间谍过家家', '葬送的芙莉莲', '迷宫饭']
const HISTORY_KEY = 'animehub-search-history'
const MAX_HISTORY = 20

function getHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch { return [] }
}

function addHistory(keyword: string) {
  const history = getHistory().filter((h) => h !== keyword)
  history.unshift(keyword)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
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
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [animeList, setAnimeList] = useState<JikanAnime[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(!!initialQuery)
  const [history, setHistory] = useState<string[]>(getHistory())
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => { setInputValue(initialQuery); setQuery(initialQuery) }, [initialQuery])

  useEffect(() => {
    if (!query.trim()) { setLoading(false); return }
    setLoading(true); setError(null)
    fetchWithRetry(`/api/anime?q=${encodeURIComponent(query.trim())}&limit=20`)
      .then((json: any) => { setAnimeList(json.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [query])

  function doSearch(keyword: string) {
    const q = keyword.trim()
    setInputValue(q)
    setQuery(q)
    setHasSearched(true)
    if (q) { setSearchParams({ q }); addHistory(q); setHistory(getHistory()) }
    else { setSearchParams({}) }
  }

  function handleSearch() { doSearch(inputValue) }

  function handleInputChange(value: string) {
    setInputValue(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      if (value.trim()) { doSearch(value) }
    }, 500)
  }

  function handleClearHistory() {
    clearHistory()
    setHistory([])
  }

  const showDefault = !hasSearched || !query.trim()

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'var(--nav-bg-scroll)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors flex-shrink-0">
            <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索动漫..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--input-text)', borderColor: 'var(--border-color)', caretColor: '#ef4444' }}
            />
          </div>
          <button onClick={handleSearch} className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-400 transition-colors flex-shrink-0">
            搜索
          </button>
        </div>
      </div>

      <div className="px-4 pb-20">
        {/* Default view: hot search + history */}
        {showDefault && (
          <>
            {/* Hot Search */}
            <div className="mt-6">
              <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>热门搜索</h3>
              <div className="grid grid-cols-2 gap-2">
                {HOT_KEYWORDS.map((kw, i) => (
                  <button
                    key={kw}
                    onClick={() => doSearch(kw)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-colors hover:bg-[var(--bg-tertiary)]"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      i < 3 ? 'bg-red-500 text-white' : 'text-[var(--text-muted)]'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{kw}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search History */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>搜索历史</h3>
                {history.length > 0 && (
                  <button onClick={handleClearHistory} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors" aria-label="清空历史">
                    <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>当前无搜索历史记录</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {history.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => doSearch(kw)}
                      className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-[var(--bg-tertiary)]"
                      style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Search results */}
        {!showDefault && (
          <>
            {loading && <div className="mt-6"><SearchSkeleton /></div>}
            {error && <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}><p>加载失败: {error}</p></div>}
            {!loading && !error && animeList.length === 0 && (
              <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}><p>没有找到相关结果</p></div>
            )}
            {!loading && !error && animeList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 mt-6">
                {animeList.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Search

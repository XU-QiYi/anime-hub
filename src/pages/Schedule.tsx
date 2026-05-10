import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { fetchWithRetry } from '../lib/fetchWithRetry'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface ScheduleAnime {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  broadcast: { string: string } | null
}

const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const DAY_KEYS = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays']

function getCurrentDayIndex(): number {
  const jsDay = new Date().getDay()
  return jsDay === 0 ? 6 : jsDay - 1
}

function parseTimeFromBroadcast(broadcast: string | null): string {
  if (!broadcast) return ''
  const match = broadcast.match(/(\d{1,2}):(\d{2})/)
  if (!match) return ''
  const bjHour = (parseInt(match[1], 10) + 1) % 24
  return `${String(bjHour).padStart(2, '0')}:${match[2]}`
}

function getDayFromBroadcast(broadcast: string | null): number {
  if (!broadcast) return -1
  for (let i = 0; i < DAY_KEYS.length; i++) {
    if (broadcast.toLowerCase().includes(DAY_KEYS[i].toLowerCase())) return i
  }
  return -1
}

function ScheduleSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="w-16 h-22 flex-shrink-0 rounded-lg animate-skeleton" />
          <div className="flex-1 space-y-3">
            <div className="h-4 animate-skeleton rounded w-3/4" />
            <div className="h-3 animate-skeleton rounded w-1/4" />
          </div>
          <div className="w-12 h-6 animate-skeleton rounded" />
        </div>
      ))}
    </div>
  )
}

function Schedule() {
  const [animeList, setAnimeList] = useState<ScheduleAnime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeDay, setActiveDay] = useState(getCurrentDayIndex())

  useEffect(() => {
    fetchWithRetry('/api/top/anime?filter=airing&limit=25')
      .then((json: any) => { setAnimeList(json.data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [])

  const grouped = useMemo(() => {
    const map: Record<number, ScheduleAnime[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    for (const anime of animeList) {
      const day = getDayFromBroadcast(anime.broadcast?.string ?? null)
      if (day >= 0) map[day].push(anime)
    }
    for (const day of Object.keys(map)) {
      map[Number(day)].sort((a, b) => parseTimeFromBroadcast(a.broadcast?.string ?? null).localeCompare(parseTimeFromBroadcast(b.broadcast?.string ?? null)))
    }
    return map
  }, [animeList])

  const currentList = grouped[activeDay] || []

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">新番时间表</h2>
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {DAY_NAMES.map((name, i) => (
            <button key={i} onClick={() => setActiveDay(i)} className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              i === activeDay ? 'bg-[#8b5cf6] text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`} style={i !== activeDay ? { backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' } : undefined}>
              {name}
            </button>
          ))}
        </div>
        {loading && <ScheduleSkeleton />}
        {error && <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}><p>加载失败: {error}</p></div>}
        {!loading && !error && currentList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 mb-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>本周暂无新番</p>
          </div>
        )}
        {!loading && !error && currentList.length > 0 && (
          <div className="space-y-3">
            {currentList.map((anime) => {
              const time = parseTimeFromBroadcast(anime.broadcast?.string ?? null)
              return (
                <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`} className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                  <div className="w-16 h-22 flex-shrink-0 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate group-hover:text-[#8b5cf6] transition-colors" style={{ color: 'var(--text-secondary)' }}>{anime.title}</h3>
                    {anime.score != null && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-yellow-400 text-xs font-medium">{anime.score}</span>
                      </div>
                    )}
                  </div>
                  {time && (
                    <div className="flex-shrink-0 text-right">
                      <span className="text-[#8b5cf6] text-sm font-medium">{time}</span>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>北京时间</p>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Schedule

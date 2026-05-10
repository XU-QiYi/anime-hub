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
  const hour = parseInt(match[1], 10)
  const minute = match[2]
  const bjHour = (hour + 1) % 24
  return `${String(bjHour).padStart(2, '0')}:${minute}`
}

function getDayFromBroadcast(broadcast: string | null): number {
  if (!broadcast) return -1
  for (let i = 0; i < DAY_KEYS.length; i++) {
    if (broadcast.toLowerCase().includes(DAY_KEYS[i].toLowerCase())) {
      return i
    }
  }
  return -1
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
      map[Number(day)].sort((a, b) => {
        const tA = parseTimeFromBroadcast(a.broadcast?.string ?? null)
        const tB = parseTimeFromBroadcast(b.broadcast?.string ?? null)
        return tA.localeCompare(tB)
      })
    }
    return map
  }, [animeList])

  const currentList = grouped[activeDay] || []

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white page-enter">
      <Navbar />

      <div className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8">新番时间表</h2>

        {/* Day Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {DAY_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                i === activeDay
                  ? 'bg-[#8b5cf6] text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]'
                  : 'bg-[#141418] text-gray-400 hover:text-white hover:bg-[#1a1a20] border border-white/5'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

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

        {!loading && !error && currentList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-700/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">本周暂无新番</p>
          </div>
        )}

        {!loading && !error && currentList.length > 0 && (
          <div className="space-y-3">
            {currentList.map((anime) => {
              const time = parseTimeFromBroadcast(anime.broadcast?.string ?? null)
              return (
                <Link
                  key={anime.mal_id}
                  to={`/anime/${anime.mal_id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#141418] border border-white/5 hover:border-[#8b5cf6]/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 group"
                >
                  <div className="w-16 h-22 flex-shrink-0 rounded-lg overflow-hidden bg-[#1a1a20]">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-200 truncate group-hover:text-[#a78bfa] transition-colors">
                      {anime.title}
                    </h3>
                    {anime.score != null && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-yellow-400 text-xs font-medium">{anime.score}</span>
                      </div>
                    )}
                  </div>
                  {time && (
                    <div className="flex-shrink-0 text-right">
                      <span className="text-[#a78bfa] text-sm font-medium">{time}</span>
                      <p className="text-gray-600 text-[10px] mt-0.5">北京时间</p>
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

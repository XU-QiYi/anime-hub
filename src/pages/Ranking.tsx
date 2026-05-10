import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWithRetry } from '../lib/fetchWithRetry'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

interface RankAnime {
  mal_id: number
  title: string
  images: { jpg: { large_image_url: string } }
  score: number | null
  members: number | null
}

type TabKey = 'score' | 'members' | 'airing'

const TABS: { key: TabKey; label: string; url: string }[] = [
  { key: 'score', label: '评分榜', url: '/api/top/anime?order_by=score&sort=desc&limit=25' },
  { key: 'members', label: '人气榜', url: '/api/top/anime?order_by=members&sort=desc&limit=25' },
  { key: 'airing', label: '热度榜', url: '/api/top/anime?filter=airing&limit=25' },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg font-bold text-yellow-400">🥇</span>
  if (rank === 2) return <span className="text-lg font-bold text-gray-300">🥈</span>
  if (rank === 3) return <span className="text-lg font-bold text-amber-600">🥉</span>
  return <span className="w-8 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>#{rank}</span>
}

function Ranking() {
  const [activeTab, setActiveTab] = useState<TabKey>('score')
  const [animeList, setAnimeList] = useState<RankAnime[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const tab = TABS.find((t) => t.key === activeTab)!
    fetchWithRetry(tab.url)
      .then((json: any) => { setAnimeList(json.data); setLoading(false) })
      .catch(() => { setAnimeList([]); setLoading(false) })
  }, [activeTab])

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">排行榜</h2>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key ? 'bg-[#8b5cf6] text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`} style={activeTab !== tab.key ? { backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' } : undefined}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="w-8 h-8 animate-skeleton rounded" />
                <div className="w-12 h-16 animate-skeleton rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 animate-skeleton rounded w-2/3" />
                  <div className="h-3 animate-skeleton rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="space-y-3">
            {animeList.map((anime, index) => {
              const rank = index + 1
              const isTop3 = rank <= 3
              return (
                <Link
                  key={anime.mal_id}
                  to={`/anime/${anime.mal_id}`}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group ${
                    isTop3 ? 'ring-1' : ''
                  }`}
                  style={{
                    backgroundColor: isTop3 ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
                    borderColor: isTop3 ? (rank === 1 ? '#eab308' : rank === 2 ? '#9ca3af' : '#b45309') + '40' : 'var(--border-color)',
                  }}
                >
                  <RankBadge rank={rank} />
                  <div className="w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate group-hover:text-[#8b5cf6] transition-colors" style={{ color: 'var(--text-secondary)' }}>
                      {anime.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      {anime.score != null && (
                        <span className="flex items-center gap-1 text-yellow-400 text-xs font-medium">★ {anime.score}</span>
                      )}
                      {anime.members != null && (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{(anime.members / 10000).toFixed(1)}万人追</span>
                      )}
                    </div>
                  </div>
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

export default Ranking

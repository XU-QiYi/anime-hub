import { Link } from 'react-router-dom'
import { useFavoriteStore, STATUS_CONFIG, type FavoriteStatus } from '../store/useFavoriteStore'

interface JikanAnime {
  mal_id: number
  title?: string
  images?: { jpg?: { large_image_url?: string } }
  score?: number | null
  genres?: { name: string }[]
}

export default function AnimeCard({ anime, index = 0 }: { anime: JikanAnime; index?: number }) {
  const status = useFavoriteStore((s) => s.getStatus(anime.mal_id))
  const progress = useFavoriteStore((s) => s.progress[anime.mal_id])

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group rounded-xl overflow-hidden border hover:border-[#8b5cf6]/40 hover:shadow-[0_0_28px_rgba(139,92,246,0.25)] transition-all duration-300 hover:scale-[1.03] relative"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#8b5cf6]/15 via-transparent to-[#6d28d9]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
      {status && (
        <div className={`absolute top-2 right-2 z-20 px-2 py-0.5 text-[10px] font-medium rounded-full border ${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].color}`}>
          {STATUS_CONFIG[status].label}
        </div>
      )}
      <div className="aspect-[3/4] overflow-hidden rounded-t-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <img
          src={anime.images?.jpg?.large_image_url || ''}
          alt={anime.title || ''}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium truncate mb-2 group-hover:text-[#8b5cf6] transition-colors" style={{ color: 'var(--text-secondary)' }}>
          {anime.title || '未知'}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-yellow-400 text-sm font-medium">{anime.score ?? '暂无'}</span>
          {progress != null && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8b5cf6]/10 text-[#8b5cf6]">P{progress}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

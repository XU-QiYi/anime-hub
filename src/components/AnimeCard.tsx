import { Link } from 'react-router-dom'

interface JikanAnime {
  mal_id: number
  title?: string
  images?: { jpg?: { large_image_url?: string } }
  score?: number | null
  genres?: { name: string }[]
}

export default function AnimeCard({
  anime,
  index = 0,
}: {
  anime: JikanAnime
  index?: number
}) {
  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group rounded-xl overflow-hidden bg-[#141418] border border-white/5 hover:border-[#8b5cf6]/40 hover:shadow-[0_0_28px_rgba(139,92,246,0.25)] transition-all duration-300 hover:scale-[1.03] relative"
      style={{ animation: `fade-in 0.4s ease-out ${index * 80}ms both` }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#8b5cf6]/15 via-transparent to-[#6d28d9]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
      <div className="aspect-[3/4] bg-[#1a1a20] overflow-hidden rounded-t-xl">
        <img
          src={anime.images?.jpg?.large_image_url || ''}
          alt={anime.title || ''}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-200 truncate mb-2 group-hover:text-[#a78bfa] transition-colors">
          {anime.title || '未知'}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-yellow-400 text-sm font-medium">
            {anime.score ?? '暂无'}
          </span>
          {(anime.genres || []).slice(0, 2).map((g) => (
            <span
              key={g.name}
              className="px-2 py-0.5 text-[10px] rounded-full bg-[#8b5cf6]/15 text-[#a78bfa] border border-[#8b5cf6]/20"
            >
              {g.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

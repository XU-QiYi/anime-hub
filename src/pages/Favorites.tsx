import { Link } from 'react-router-dom'
import { useFavoriteStore } from '../store/useFavoriteStore'

function Favorites() {
  const favorites = useFavoriteStore((s) => s.favorites)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="text-2xl font-bold text-[#8b5cf6]">
          AnimeHub
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            首页
          </Link>
          <Link
            to="/favorites"
            className="text-sm text-[#a78bfa] font-medium transition-colors"
          >
            追番
          </Link>
        </div>
      </nav>

      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">我的追番</h2>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg mb-2">还没有追番哦</p>
            <Link
              to="/"
              className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
            >
              去首页看看吧 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favorites.map((anime) => (
              <Link
                key={anime.mal_id}
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites

import { Link } from 'react-router-dom'
import { useFavoriteStore } from '../store/useFavoriteStore'
import Navbar from '../components/Navbar'
import AnimeCard from '../components/AnimeCard'
import Footer from '../components/Footer'

function Favorites() {
  const favorites = useFavoriteStore((s) => s.favorites)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white page-enter">
      <Navbar />

      <div className="px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold text-white">我的追番</h2>
          {favorites.length > 0 && (
            <span className="px-2.5 py-0.5 text-xs rounded-full bg-[#8b5cf6]/20 text-[#a78bfa] border border-[#8b5cf6]/25">
              {favorites.length} 部
            </span>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-gray-500">
            <svg className="w-20 h-20 mb-5 text-gray-700/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-lg mb-2 text-gray-400">还没有追番哦</p>
            <Link
              to="/"
              className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors text-sm"
            >
              去首页看看吧 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((anime, index) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={index} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Favorites

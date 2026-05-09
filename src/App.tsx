import { useState } from 'react'

const animeList = [
  { id: 1, title: '进击的巨人', rating: 9.8, cover: '' },
  { id: 2, title: '鬼灭之刃', rating: 9.6, cover: '' },
  { id: 3, title: '咒术回战', rating: 9.4, cover: '' },
  { id: 4, title: '间谍过家家', rating: 9.5, cover: '' },
]

function App() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <h1 className="text-2xl font-bold text-[#8b5cf6]">AnimeHub</h1>
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
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-56 pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 transition-all"
            />
          </div>
        </div>
      </nav>

      {/* Banner */}
      <section className="mx-6 mt-4 rounded-2xl overflow-hidden">
        <div className="relative h-72 bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#6d28d9] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">热门番剧推荐</h2>
            <p className="text-white/70 text-lg">发现更多精彩动漫内容</p>
          </div>
          <div className="absolute inset-0 bg-[#0a0a0a]/20" />
        </div>
      </section>

      {/* Hot Recommendations */}
      <section className="px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">热门推荐</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {animeList.map((anime) => (
            <div
              key={anime.id}
              className="group cursor-pointer rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-[#8b5cf6]/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] transition-all duration-300 hover:scale-[1.03]"
            >
              <div className="aspect-[3/4] bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-600"
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
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-200 truncate mb-2 group-hover:text-[#a78bfa] transition-colors">
                  {anime.title}
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-yellow-400 text-sm font-medium">
                    {anime.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App

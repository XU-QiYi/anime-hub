import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchValue, setSearchValue] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSearch() {
    const q = searchValue.trim()
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`)
    } else {
      navigate('/search')
    }
  }

  const isHome = location.pathname === '/'
  const isFav = location.pathname === '/favorites'
  const isSchedule = location.pathname === '/schedule'

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b border-white/5 transition-colors duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/95' : 'bg-[#0a0a0a]/70'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-[#8b5cf6] tracking-tight">
          AnimeHub
        </Link>
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className={`text-sm transition-colors ${
              isHome ? 'text-[#a78bfa] font-medium' : 'text-gray-400 hover:text-white'
            }`}
          >
            首页
          </Link>
          <Link
            to="/favorites"
            className={`text-sm transition-colors ${
              isFav ? 'text-[#a78bfa] font-medium' : 'text-gray-400 hover:text-white'
            }`}
          >
            追番
          </Link>
          <Link
            to="/schedule"
            className={`text-sm transition-colors ${
              isSchedule ? 'text-[#a78bfa] font-medium' : 'text-gray-400 hover:text-white'
            }`}
          >
            时间表
          </Link>
          {location.pathname !== '/search' && (
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-56 pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/10 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 transition-all"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

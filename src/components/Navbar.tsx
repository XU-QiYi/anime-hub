import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useThemeStore } from '../store/useThemeStore'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchValue, setSearchValue] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSearch() {
    const q = searchValue.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`); else navigate('/search')
  }

  const isActive = (path: string) => location.pathname === path
  const linkClass = (active: boolean) =>
    `text-sm transition-colors ${active ? 'text-[#8b5cf6] font-medium' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${scrolled ? 'border-[var(--border-color)]' : 'border-transparent'}`}
      style={{ backgroundColor: scrolled ? 'var(--nav-bg-scroll)' : 'var(--nav-bg)' }}
    >
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-[#8b5cf6] tracking-tight">AnimeHub</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className={linkClass(isActive('/'))}>首页</Link>
          <Link to="/favorites" className={linkClass(isActive('/favorites'))}>追番</Link>
          <Link to="/history" className={linkClass(isActive('/history'))}>历史</Link>
          <Link to="/schedule" className={linkClass(isActive('/schedule'))}>时间表</Link>
          <Link to="/ranking" className={linkClass(isActive('/ranking'))}>排行榜</Link>
          <Link to="/category" className={linkClass(isActive('/category'))}>分类</Link>
          {location.pathname !== '/search' && (
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" placeholder="搜索..." value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-44 pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all"
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
              />
            </div>
          )}
          <Link to="/settings" className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-tertiary)]" aria-label="设置">
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
          <button onClick={toggleTheme} className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-tertiary)]" aria-label="切换主题">
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

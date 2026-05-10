import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useThemeStore } from '../store/useThemeStore'
import { useAuthStore } from '../store/authStore'

const TAB_ITEMS = [
  { path: '/', label: '首页', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { path: '/favorites', label: '追番', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )},
  { path: '/ranking', label: '排行', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )},
  { path: '/settings', label: '我的', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )},
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchValue, setSearchValue] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)

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
    <>
      {/* Desktop top navbar */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 hidden md:block ${scrolled ? 'border-[var(--border-color)]' : 'border-transparent'}`}
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
            {user ? (
              <Link to="/profile" className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white transition-colors hover:ring-2 hover:ring-[var(--accent)]" style={{ backgroundColor: '#8b5cf6' }}>
                {(profile?.username || user.email || '?').charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: 'var(--text-muted)' }}>
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav
        className={`sticky top-0 z-50 md:hidden backdrop-blur-md border-b transition-colors duration-300 ${scrolled ? 'border-[var(--border-color)]' : 'border-transparent'}`}
        style={{ backgroundColor: scrolled ? 'var(--nav-bg-scroll)' : 'var(--nav-bg)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold text-[#8b5cf6] tracking-tight">AnimeHub</Link>
          <div className="flex items-center gap-2">
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
            {user ? (
              <Link to="/profile" className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white transition-colors hover:ring-2 hover:ring-[var(--accent)]" style={{ backgroundColor: '#8b5cf6' }}>
                {(profile?.username || user.email || '?').charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: 'var(--text-muted)' }}>
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t backdrop-blur-md" style={{ backgroundColor: 'var(--nav-bg-scroll)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-around py-2">
          {TAB_ITEMS.map((tab) => {
            const active = isActive(tab.path)
            return (
              <Link key={tab.path} to={tab.path} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${active ? 'text-[#8b5cf6]' : 'text-[var(--text-muted)]'}`}>
                {tab.icon(active)}
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

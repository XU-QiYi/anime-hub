import { useThemeStore } from '../store/useThemeStore'
import { useHistoryStore } from '../store/useHistoryStore'
import { useFavoriteStore } from '../store/useFavoriteStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Settings() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const clearHistory = useHistoryStore((s) => s.clearHistory)
  const clearFavorites = () => {
    localStorage.removeItem('animehub-favorites')
    window.location.reload()
  }

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">设置</h2>

        {/* Theme */}
        <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-lg font-semibold mb-4">外观</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>主题模式</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>当前：{theme === 'dark' ? '深色' : '亮色'}</p>
            </div>
            <button onClick={toggleTheme} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" style={{ backgroundColor: theme === 'dark' ? '#8b5cf6' : '#d1d5db' }}>
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Clear Data */}
        <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-lg font-semibold mb-4">数据管理</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>观看历史</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>清除所有观看记录</p>
              </div>
              <button onClick={clearHistory} className="px-4 py-1.5 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                清除
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>追番列表</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>清除所有追番数据和观看进度</p>
              </div>
              <button onClick={clearFavorites} className="px-4 py-1.5 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                清除
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-lg font-semibold mb-4">关于</h3>
          <div className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <p>版本：v1.0.0</p>
            <p>技术栈：React + Tailwind CSS + Zustand + Vite</p>
            <p>数据源：<a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors">Jikan API</a></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Settings

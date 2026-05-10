import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MENU_ITEMS = [
  { label: '我的追番', path: '/favorites', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  )},
  { label: '观看历史', path: '/history', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )},
  { label: '设置', path: '/settings', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  )},
]

function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)
  const uploadAvatar = useAuthStore((s) => s.uploadAvatar)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    await uploadAvatar(file)
    setUploading(false)
    e.target.value = ''
  }

  if (!user) {
    return (
      <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Navbar />
        <div className="flex items-center justify-center px-4 py-16 sm:py-24">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🎌</div>
            <h1 className="text-3xl font-bold mb-3">AnimeHub</h1>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
              登录后可以同步追番数据、发表评论、发送弹幕
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                style={{ backgroundColor: '#8b5cf6', color: 'var(--bg-primary)' }}
              >
                登录
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-[var(--bg-tertiary)]"
                style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
              >
                注册
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const displayName = profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || '用户'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-2xl mx-auto">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="relative w-16 h-16 rounded-full shrink-0 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="头像" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: '#8b5cf6' }}
              >
                {initial}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {uploading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <div>
            <p className="text-lg font-semibold">{displayName}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="rounded-xl border overflow-hidden mb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          {MENU_ITEMS.map((item, i) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-5 py-4 transition-colors hover:bg-[var(--bg-tertiary)] ${i !== MENU_ITEMS.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl text-sm font-medium border transition-colors hover:bg-red-500/10"
          style={{ color: '#ef4444', borderColor: '#ef4444' }}
        >
          退出登录
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default Profile

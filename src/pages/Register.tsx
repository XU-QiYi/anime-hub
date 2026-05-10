import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Register() {
  const navigate = useNavigate()
  const signUp = useAuthStore((s) => s.signUp)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (username.trim().length < 2) {
      setError('用户名至少需要 2 个字符')
      return
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)
    const result = await signUp(email, password, username)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16 sm:py-24">
        <div
          className="w-full max-w-md rounded-2xl border p-8"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">创建账号</h1>
            <p style={{ color: 'var(--text-muted)' }}>加入 AnimeHub 的追番世界</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="你的昵称"
                required
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                确认密码
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              style={{ backgroundColor: '#8b5cf6', color: 'var(--bg-primary)' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#7c3aed')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8b5cf6')}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  注册中...
                </span>
              ) : (
                '注册'
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            已有账号？{' '}
            <Link to="/login" className="font-medium hover:underline" style={{ color: '#8b5cf6' }}>
              立即登录
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Register

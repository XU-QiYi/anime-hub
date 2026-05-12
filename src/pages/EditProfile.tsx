import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/Toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken'

function EditProfile() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const fetchProfile = useAuthStore((s) => s.fetchProfile)
  const { showToast, toastEl } = useToast()

  const [username, setUsername] = useState(profile?.username || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [saving, setSaving] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const [usernameError, setUsernameError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (!profile) return
    setUsername(profile.username)
    setBio(profile.bio || '')
  }, [profile])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!profile) {
      fetchProfile()
    }
  }, [user, profile, navigate, fetchProfile])

  useEffect(() => {
    if (!username.trim() || username.trim() === profile?.username) {
      setUsernameStatus('idle')
      setUsernameError('')
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    setUsernameStatus('checking')
    setUsernameError('')

    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.trim())
        .neq('id', user!.id)
        .maybeSingle()

      if (data) {
        setUsernameStatus('taken')
        setUsernameError('该用户名已被占用')
      } else {
        setUsernameStatus('available')
        setUsernameError('')
      }
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [username, profile?.username, user])

  const isValid = username.trim().length > 0 && usernameStatus !== 'taken' && usernameStatus !== 'checking'
  const isChanged = username.trim() !== profile?.username || bio !== (profile?.bio || '')

  async function handleSave() {
    if (!isValid || !isChanged) return
    setSaving(true)
    const { error } = await updateProfile({ username: username.trim(), bio })
    setSaving(false)

    if (error) {
      showToast('保存失败：' + error)
      return
    }

    showToast('保存成功')
    setTimeout(() => navigate('/profile'), 1500)
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen page-enter" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center gap-2 mb-6 text-sm transition-colors hover:text-[#8b5cf6]"
          style={{ color: 'var(--text-muted)' }}
        >
          ← 返回个人中心
        </button>

        <h2 className="text-2xl font-bold mb-8">编辑资料</h2>

        <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          {/* Username */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors focus:border-[#8b5cf6]"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: usernameError ? '#ef4444' : 'var(--border-color)' }}
            />
            <div className="flex items-center justify-between mt-2">
              <div>
                {usernameStatus === 'checking' && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>检查中...</span>
                )}
                {usernameStatus === 'available' && (
                  <span className="text-xs text-green-400">✓ 可用</span>
                )}
                {usernameStatus === 'taken' && (
                  <span className="text-xs text-red-400">✗ {usernameError}</span>
                )}
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{username.length}/20</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              简介
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none transition-colors focus:border-[#8b5cf6]"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              placeholder="介绍一下自己..."
            />
            <div className="text-right mt-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{bio.length}/200</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 py-3 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || !isChanged || saving}
            className="flex-1 py-3 rounded-xl text-sm font-medium bg-[#8b5cf6] text-white transition-all hover:bg-[#7c3aed] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
      <Footer />
      {toastEl}
    </div>
  )
}

export default EditProfile

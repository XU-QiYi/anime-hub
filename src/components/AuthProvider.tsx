import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialized = useAuthStore((s) => s.initialized)
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!initialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return <>{children}</>
}

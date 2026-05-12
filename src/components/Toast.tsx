import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDone: () => void
}

function Toast({ message, onDone }: ToastProps) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 1800)
    const remove = setTimeout(onDone, 2000)
    return () => { clearTimeout(timer); clearTimeout(remove) }
  }, [onDone])

  return (
    <>
      {/* Mobile: slide down from top */}
      <div
        className={`
          fixed z-50 top-[calc(env(safe-area-inset-top)+12px)]
          left-1/2 -translate-x-1/2 w-fit min-w-32 max-w-[85vw]
          px-4 py-2
          rounded-xl text-sm text-center whitespace-nowrap
          border shadow-lg backdrop-blur-md
          md:hidden
          ${exiting ? 'animate-slide-up' : 'animate-slide-down'}
        `}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {message}
      </div>

      {/* Desktop: slide in from right */}
      <div
        className={`
          fixed z-50 top-20 right-6 max-w-sm
          hidden md:block
          px-5 py-3
          rounded-xl text-sm whitespace-nowrap
          border shadow-lg backdrop-blur-md
          ${exiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
        `}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
        }}
      >
        {message}
      </div>
    </>
  )
}

export function useToast() {
  const [toast, setToast] = useState<string | null>(null)

  function showToast(message: string) {
    setToast(message)
  }

  function dismissToast() {
    setToast(null)
  }

  const toastEl = toast ? (
    <Toast message={toast} onDone={dismissToast} />
  ) : null

  return { showToast, toastEl }
}

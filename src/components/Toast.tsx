import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDone: () => void
}

function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-gray-900 border border-white/10 text-white text-sm shadow-lg animate-fade-in">
      {message}
    </div>
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

import { useEffect } from 'react'
import { useThemeStore } from '../store/useThemeStore'

declare global {
  interface Window {
    StatusBarBridge?: {
      setStatusBarStyle: (dark: boolean) => void
    }
  }
}

function syncStatusBar(theme: 'dark' | 'light') {
  const dark = theme === 'dark'
  console.log('[ThemeProvider] syncStatusBar:', theme, 'bridge exists:', !!window.StatusBarBridge)
  if (window.StatusBarBridge) {
    window.StatusBarBridge.setStatusBarStyle(dark)
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    syncStatusBar(theme)
  }, [theme])

  useEffect(() => {
    syncStatusBar(theme)
  }, [])

  return <>{children}</>
}

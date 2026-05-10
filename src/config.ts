const JIKAN_BASE = 'https://api.jikan.moe/v4'

export function apiUrl(path: string): string {
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window && path.startsWith('/api/')) {
    return `${JIKAN_BASE}${path.slice(4)}`
  }
  return path
}

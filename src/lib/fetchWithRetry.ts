import { apiUrl } from '../config'

export async function fetchWithRetry(url: string, retries = 3): Promise<unknown> {
  const resolved = apiUrl(url)
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(resolved)
      if (!res.ok) throw new Error(`API 请求失败: ${res.status}`)
      return await res.json()
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
  throw new Error('Unreachable')
}

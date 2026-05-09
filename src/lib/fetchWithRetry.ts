export async function fetchWithRetry(url: string, retries = 3): Promise<unknown> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`API 请求失败: ${res.status}`)
      return await res.json()
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
  throw new Error('Unreachable')
}

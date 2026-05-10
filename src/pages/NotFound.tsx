import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center px-6 page-enter">
      <h1 className="text-[8rem] font-bold text-[#8b5cf6] leading-none mb-4">404</h1>
      <p className="text-xl text-[var(--text-muted)] mb-8">页面走丢了</p>
      <Link
        to="/"
        className="px-8 py-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] hover:shadow-[0_0_24px_rgba(139,92,246,0.4)] text-white font-medium transition-all"
      >
        返回首页
      </Link>
    </div>
  )
}

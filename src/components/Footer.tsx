import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t py-8 text-center text-xs mt-12" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
      <p>Powered by <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="text-[#8b5cf6]/60 hover:text-[#8b5cf6] transition-colors">Jikan API</a></p>
    </footer>
  )
}

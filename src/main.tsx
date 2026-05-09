import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AnimeDetail from './pages/AnimeDetail.tsx'
import Search from './pages/Search.tsx'
import Favorites from './pages/Favorites.tsx'
import Player from './pages/Player.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/search" element={<Search />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/player/:id" element={<Player />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)

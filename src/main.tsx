import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AnimeDetail from './pages/AnimeDetail.tsx'
import Search from './pages/Search.tsx'
import Favorites from './pages/Favorites.tsx'
import Player from './pages/Player.tsx'
import Schedule from './pages/Schedule.tsx'
import Category from './pages/Category.tsx'
import Ranking from './pages/Ranking.tsx'
import History from './pages/History.tsx'
import Settings from './pages/Settings.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Profile from './pages/Profile.tsx'
import EditProfile from './pages/EditProfile.tsx'
import NotFound from './pages/NotFound.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import ThemeProvider from './components/ThemeProvider.tsx'
import AuthProvider from './components/AuthProvider.tsx'
import BackToTop from './components/BackToTop.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/search" element={<Search />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/category" element={<Category />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BackToTop />
        </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

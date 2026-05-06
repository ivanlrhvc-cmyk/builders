import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import BuilderProfile from './pages/BuilderProfile'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Setup from './pages/Setup'
import Dashboard from './pages/Dashboard'
import ParticleBackground from './components/ParticleBackground'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppLayout() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')
  const isAuth = ['/login', '/registro', '/setup'].includes(location.pathname) || location.pathname.startsWith('/dashboard')

  return (
    <div className="app-container">
      <ParticleBackground />
      {!isAuth && <Nav />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder/:slug" element={<BuilderProfile />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isDashboard && !isAuth && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  )
}

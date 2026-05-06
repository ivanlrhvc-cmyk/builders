import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layers, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-left"></div>
      <Link to="/" className="nav-brand">
        <Layers size={24} color="var(--accent-color)" />
        Builders<span>.</span>
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-primary">Mi perfil</Link>
            <button onClick={handleLogout} className="nav-logout" aria-label="Cerrar sesión">
              <LogOut size={17} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Iniciar sesión</Link>
            <Link to="/registro" className="btn btn-primary">Únete</Link>
          </>
        )}
      </div>
    </nav>
  )
}

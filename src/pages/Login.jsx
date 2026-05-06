import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const { error } = await signIn(email, password)
    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }
    
    setIsSuccess(true)
    setTimeout(() => {
      navigate('/dashboard')
    }, 2500)
  }

  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="success-animation-wrapper">
          <div className="success-circle">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <p className="success-text">Acceso concedido</p>
          <div className="success-ripple"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <Link to="/" className="auth-brand">
        <Layers color="var(--accent-color)" size={28} />
        Builders<span>.</span>
      </Link>
      
      <div className="auth-card">
        <h1 className="auth-title">Bienvenido de nuevo</h1>
        <p className="auth-subtitle">Accede a tu panel de control</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          {error && <p className="auth-error">{error}</p>}
          
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Verificando...' : (
              <>
                Entrar <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>¿No tienes cuenta? <Link to="/registro">Únete gratis</Link></p>
        </div>
      </div>
    </div>
  )
}

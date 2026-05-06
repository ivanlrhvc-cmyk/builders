import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User as UserIcon, ArrowRight, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Registro() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setLoading(true)
    const { data, error } = await signUp(email, password, name)
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      setIsSuccess(true)
      setTimeout(() => navigate('/setup'), 2500)
    } else {
      setNeedsConfirmation(true)
    }
  }

  if (needsConfirmation) {
    return (
      <div className="auth-container">
        <Link to="/" className="auth-brand">
          <Layers color="var(--accent-color)" size={28} />
          Builders<span>.</span>
        </Link>
        <div className="auth-card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
          <h1 className="auth-title">Revisa tu email</h1>
          <p className="auth-subtitle" style={{ marginTop: '0.75rem' }}>
            Enviamos un enlace de confirmación a <strong>{email}</strong>.<br />
            Ábrelo para activar tu cuenta y completar tu perfil.
          </p>
        </div>
      </div>
    )
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
          <p className="success-text">¡Cuenta creada!</p>
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
        <h1 className="auth-title">Únete a Builders</h1>
        <p className="auth-subtitle">Muestra lo que construyes al mundo</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon">
              <UserIcon size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          
          {error && <p className="auth-error">{error}</p>}
          
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : (
              <>
                Crear cuenta <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  )
}

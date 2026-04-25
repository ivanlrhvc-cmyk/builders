import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <span className="nav-logo">Builders</span>
      <ul className="nav-links">
        <li><button onClick={() => scrollTo('projects')}>Proyectos</button></li>
        <li><button onClick={() => scrollTo('stack')}>Stack</button></li>
        <li><button onClick={() => scrollTo('contact')}>Contacto</button></li>
      </ul>
    </nav>
  )
}

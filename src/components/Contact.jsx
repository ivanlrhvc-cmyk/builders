import { useState } from 'react'

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID

export default function Contact() {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section" id="contact">
      <div className="section-inner section-inner--narrow">
        <div className="section-header">
          <h2 className="section-title">Hablemos</h2>
          <p className="section-sub">
            ¿Tienes un proyecto en mente o quieres conectar?
          </p>
        </div>

        {status === 'success' ? (
          <div className="contact-success">
            Mensaje enviado. Te respondo en menos de 48h.
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input id="name" name="name" type="text" required placeholder="Tu nombre" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required placeholder="tu@email.com" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea id="message" name="message" required rows={5} placeholder="Cuéntame en qué puedo ayudarte..." />
            </div>
            {status === 'error' && (
              <p className="form-error">Algo fue mal. Prueba de nuevo o escríbeme por LinkedIn.</p>
            )}
            <button className="btn-primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        )}

        <p className="contact-alt">
          También en{' '}
          <a href="https://linkedin.com/in/[URL_LINKEDIN]" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </section>
  )
}

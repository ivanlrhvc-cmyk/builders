import { useState, useEffect } from 'react'
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { STATUS_LABEL, STATUS_COLOR } from '../data/constants'

export default function ProjectModal({ project, onClose }) {
  const [currentImg, setCurrentImg] = useState(0)

  const screenshots = project?.screenshots || []
  const hasMultiple = screenshots.length > 1

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasMultiple) setCurrentImg(i => (i - 1 + screenshots.length) % screenshots.length)
      if (e.key === 'ArrowRight' && hasMultiple) setCurrentImg(i => (i + 1) % screenshots.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [hasMultiple, screenshots.length, onClose])

  if (!project) return null

  const statusLabel = STATUS_LABEL[project.status] || project.status
  const statusColor = STATUS_COLOR[project.status] || '#888'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content split-layout" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={16} /></button>

        <div className="modal-layout-grid">
          <div className="modal-media">
            {screenshots[currentImg] ? (
              <img src={screenshots[currentImg]} alt={project.name} />
            ) : (
              <div className="modal-media-placeholder">
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-muted)', opacity: 0.3 }}>
                  {project.name}
                </span>
              </div>
            )}
            {hasMultiple && (
              <>
                <button className="modal-nav-btn modal-nav-btn--prev" onClick={e => { e.stopPropagation(); setCurrentImg(i => (i - 1 + screenshots.length) % screenshots.length) }}>
                  <ChevronLeft size={16} />
                </button>
                <button className="modal-nav-btn modal-nav-btn--next" onClick={e => { e.stopPropagation(); setCurrentImg(i => (i + 1) % screenshots.length) }}>
                  <ChevronRight size={16} />
                </button>
                <div className="modal-dots">
                  {screenshots.map((_, i) => (
                    <button key={i} className={`modal-dot${i === currentImg ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setCurrentImg(i) }} />
                  ))}
                </div>
              </>
            )}
            <span className="modal-status-badge" style={{ background: `${statusColor}18`, color: statusColor }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor, display: 'inline-block', flexShrink: 0 }} />
              {statusLabel}
            </span>
          </div>

          <div className="modal-info">
            <Link to={`/builder/${project.builder.slug}`} className="modal-builder-pill" onClick={onClose}>
              <div className="builder-avatar" style={{ width: 24, height: 24, fontSize: '0.7rem', flexShrink: 0 }}>
                {project.builder.name.charAt(0)}
              </div>
              <span className="modal-builder-pill-name">{project.builder.name}</span>
            </Link>

            <h2 className="modal-title">{project.name}</h2>
            <p className="modal-tagline">{project.tagline}</p>

            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-accent modal-cta">
                Abrir App <ExternalLink size={13} />
              </a>
            )}

            {project.problem && (
              <div className="modal-section">
                <h3>El Problema</h3>
                <p>{project.problem}</p>
              </div>
            )}

            {project.how && (
              <div className="modal-section">
                <h3>La Solución</h3>
                <p>{project.how}</p>
              </div>
            )}

            {project.features?.length > 0 && (
              <div className="modal-section">
                <h3>Funcionalidades</h3>
                <ul className="modal-features-list">
                  {project.features.map((feat, i) => (
                    <li key={i}>
                      <strong>{feat.title}</strong>
                      <span>{feat.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

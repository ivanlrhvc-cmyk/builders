const STATUS = {
  live:        { label: 'En vivo',          color: '#1a7a5e' },
  demo:        { label: 'Demo interactiva', color: '#1d5fa8' },
  development: { label: 'En desarrollo',    color: '#b45309' },
  concept:     { label: 'Concepto',         color: '#8c8a85' },
}

export default function ProjectCard({ project, onClick }) {
  const status = STATUS[project.status]

  return (
    <article className="project-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="project-card-header">
        <h3 className="project-name">{project.name}</h3>
        <span className="project-status" style={{ color: status.color }}>
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="4" fill={status.color} />
          </svg>
          {status.label}
        </span>
      </div>

      <p className="project-tagline">{project.tagline}</p>
      <p className="project-description">{project.description}</p>

      <div className="project-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="project-card-footer">
        <span className="project-card-cta">
          Ver proyecto
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </article>
  )
}

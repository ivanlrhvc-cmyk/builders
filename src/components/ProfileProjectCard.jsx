const STATUS = {
  live:        { label: 'En vivo',          color: '#1a7a5e', bg: '#e8f4ed' },
  demo:        { label: 'Demo interactiva', color: '#1d5fa8', bg: '#e8f0fa' },
  development: { label: 'En desarrollo',    color: '#b45309', bg: '#fef3e2' },
  concept:     { label: 'Concepto',         color: '#8c8a85', bg: '#f0efec' },
}

const PLACEHOLDER_GRADIENTS = {
  live:        'linear-gradient(135deg, #e8f4ed 0%, #c8e6d0 100%)',
  demo:        'linear-gradient(135deg, #e8f0fa 0%, #c5d8f5 100%)',
  development: 'linear-gradient(135deg, #fef3e2 0%, #fde0a8 100%)',
  concept:     'linear-gradient(135deg, #f0efec 0%, #dddbd4 100%)',
}

export default function ProfileProjectCard({ project, onClick }) {
  const status = STATUS[project.status]
  const hasScreenshot = project.screenshots && project.screenshots.length > 0
  const problemExcerpt = project.problem
    ? project.problem.slice(0, 120) + (project.problem.length > 120 ? '…' : '')
    : null

  return (
    <article className="profile-project-card" onClick={onClick}>
      <div className="profile-project-content">
        <div className="profile-project-top">
          <span className="profile-project-status" style={{ color: status.color, background: status.bg }}>
            <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="4" fill={status.color} />
            </svg>
            {status.label}
          </span>
        </div>

        <h3 className="profile-project-name">{project.name}</h3>
        <p className="profile-project-tagline">{project.tagline}</p>

        {problemExcerpt && (
          <p className="profile-project-problem">{problemExcerpt}</p>
        )}

        <div className="project-tags" style={{ marginBottom: '24px' }}>
          {project.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="profile-project-actions">
          <button className="profile-project-cta">
            Ver proyecto
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {project.status === 'live' && project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-project-link"
              onClick={(e) => e.stopPropagation()}
            >
              Abrir app
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      <div
        className="profile-project-visual"
        style={{ background: hasScreenshot ? undefined : PLACEHOLDER_GRADIENTS[project.status] }}
      >
        {hasScreenshot ? (
          <img
            src={project.screenshots[0]}
            alt={`${project.name} — captura`}
            className="profile-project-screenshot"
            loading="lazy"
          />
        ) : (
          <div className="profile-project-placeholder">
            <span className="profile-project-placeholder-name">{project.name}</span>
            <span className="profile-project-placeholder-sub">{project.tagline}</span>
          </div>
        )}
      </div>
    </article>
  )
}

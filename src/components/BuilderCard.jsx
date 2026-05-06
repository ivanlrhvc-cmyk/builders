import { Link } from 'react-router-dom'

export default function BuilderCard({ builder }) {
  const liveCount = builder.projects.filter(p => p.status === 'live').length

  return (
    <Link to={`/builder/${builder.slug}`} className="builder-card">
      <div className="builder-card-header">
        <div className="builder-card-avatar">
          {builder.avatar ? (
            <img src={builder.avatar} alt={builder.name} />
          ) : (
            builder.name.charAt(0)
          )}
        </div>
        <div>
          <h3 className="builder-card-name">{builder.name}</h3>
          {builder.location && <p className="builder-card-location">{builder.location}</p>}
        </div>
      </div>
      {builder.bio && <p className="builder-card-bio">{builder.bio}</p>}
      {builder.labels?.length > 0 && (
        <div className="builder-card-tags">
          {builder.labels.slice(0, 3).map(l => (
            <span key={l} className="tag">{l}</span>
          ))}
        </div>
      )}
      <p className="builder-card-meta">
        {builder.projects.length} {builder.projects.length === 1 ? 'proyecto' : 'proyectos'}
        {liveCount > 0 && ` · ${liveCount} en vivo`}
      </p>
    </Link>
  )
}

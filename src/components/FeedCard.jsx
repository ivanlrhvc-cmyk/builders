import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';

export default function FeedCard({ project, onClick, hideBuilder }) {
  const { builder } = project;
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'none',
      boxShadow: `${-rotateY}px ${rotateX}px 30px rgba(139, 92, 246, 0.15)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease, box-shadow 0.5s ease',
      boxShadow: 'none'
    });
  };
  
  return (
    <article 
      ref={cardRef}
      className="feed-card glass" 
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...tiltStyle, willChange: 'transform' }}
    >
      <div style={{ height: '160px', width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(135deg, var(--bg-main), var(--accent-glow))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {project.screenshots && project.screenshots[0] ? (
          <img 
            src={project.screenshots[0]} 
            alt={project.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <span style={{ fontSize: '4rem', opacity: 0.1, fontWeight: 'bold', color: 'var(--text-primary)' }}>{project.name.charAt(0)}</span>
        )}
      </div>
      <div className="feed-card-header">
        <div>
          <h3 className="feed-card-title">{project.name}</h3>
          <p className="feed-card-tagline">{project.tagline}</p>
        </div>
        <div className={`status-dot ${project.status}`} title={project.status === 'live' ? 'En vivo' : 'En desarrollo'} />
      </div>
      
      <div className="tags">
        {project.tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      
      {(!hideBuilder || project.url) && (
        <div className="feed-card-footer" style={hideBuilder ? { justifyContent: 'flex-end' } : {}}>
          {!hideBuilder && (
            <Link
              to={`/builder/${builder.slug}`}
              className="builder-info"
              style={{ transition: 'var(--transition-fast)' }}
              onClick={(e) => e.stopPropagation()}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}
            >
              <div className="builder-avatar">
                {builder.avatar ? (
                  <img src={builder.avatar} alt={builder.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  builder.name.charAt(0)
                )}
              </div>
              <span className="builder-name">{builder.name}</span>
            </Link>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              Abrir <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}
    </article>
  );
}

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBuilderBySlug } from '../data/builders'
import { supabase, uploadAvatar, uploadScreenshot } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import FeedCard from '../components/FeedCard'
import ProjectModal from '../components/ProjectModal'
import ProjectForm from '../components/ProjectForm'
import ProfileForm from '../components/ProfileForm'
import { formatUrl } from '../lib/utils'

function normalizeSupabaseBuilder(b) {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    bio: b.bio || '',
    background: b.background || '',
    location: b.location || '',
    labels: b.labels || [],
    sectors: b.sectors || [],
    avatar: b.avatar_url,
    links: b.links || {},
    stack: b.stack || [],
    createdAt: b.created_at,
    stats: { followers: 0, following: 0 },
    projects: (b.projects || []).map(normalizeProject),
  }
}

function normalizeProject(p) {
  return {
    id: p.id,
    builder_id: p.builder_id,
    name: p.title,
    tagline: p.description || '',
    status: p.status,
    url: p.url || '',
    screenshots: p.screenshot_url ? [p.screenshot_url] : [],
    tags: p.tags || [],
    features: p.features || [],
    problem: p.problem || '',
    how: p.how || '',
    featured: p.featured || false,
    order_index: p.order_index ?? 0,
  }
}

export default function BuilderProfile() {
  const { slug } = useParams()
  const { user } = useAuth()
  const staticBuilder = getBuilderBySlug(slug)

  const [supabaseBuilder, setSupabaseBuilder] = useState(null)
  const [loadingBuilder, setLoadingBuilder] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editProfile, setEditProfile] = useState({})
  const [projects, setProjects] = useState([])
  const [editingProject, setEditingProject] = useState(null)
  const [activeProject, setActiveProject] = useState(null)
  const [isPublished, setIsPublished] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase
      .from('builders')
      .select('*, projects(*)')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') console.error(error)
        if (data) {
          const normalized = normalizeSupabaseBuilder(data)
          setSupabaseBuilder(normalized)
          setProjects(normalized.projects)
          setIsPublished(data.published || false)
          setEditProfile({
            name: data.name,
            bio: data.bio || '',
            background: data.background || '',
            location: data.location || '',
            labels: data.labels || [],
            sectors: data.sectors || [],
            links: data.links || {},
            avatar: data.avatar_url,
            stack: data.stack || [],
          })
        }
        setLoadingBuilder(false)
      })
  }, [slug])

  const builder = supabaseBuilder || staticBuilder
  const isOwner = !!user && !!supabaseBuilder && user.id === supabaseBuilder.id
  const rawProjects = isOwner ? projects : (builder?.projects || [])
  const displayProjects = [...rawProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return a.order_index - b.order_index
  })

  async function handleSaveProfile() {
    try {
      let avatarUrl = editProfile.avatar || null
      if (editProfile._avatarFile) {
        avatarUrl = await uploadAvatar(user.id, editProfile._avatarFile)
      }

      const { data: updated, error } = await supabase
        .from('builders')
        .update({
          name: editProfile.name,
          bio: editProfile.bio,
          background: editProfile.background || null,
          location: editProfile.location || null,
          labels: editProfile.labels || [],
          sectors: editProfile.sectors || [],
          links: {
            linkedin: formatUrl(editProfile.links?.linkedin),
            github: formatUrl(editProfile.links?.github),
            web: formatUrl(editProfile.links?.web),
          },
          avatar_url: avatarUrl,
          stack: editProfile.stack || [],
        })
        .eq('id', user.id)
        .select('*, projects(*)')
        .single()

      if (error) throw error

      if (updated) setSupabaseBuilder(normalizeSupabaseBuilder(updated))
      setIsEditing(false)
    } catch (error) {
      console.error(error)
      alert('Hubo un error al guardar tu perfil. Por favor, inténtalo de nuevo.')
    }
  }

  async function handleSaveProject(data) {
    try {
      const { _screenshotFiles, ...cleanData } = data

      const screenshotUrls = await Promise.all(
        (cleanData.screenshots || []).map(async (url, i) => {
          const file = _screenshotFiles?.[i]
          if (file) return await uploadScreenshot(user.id, file)
          return url
        })
      )

      const dbData = {
        title: cleanData.name,
        description: cleanData.tagline || cleanData.description || null,
        status: cleanData.status,
        url: formatUrl(cleanData.url) || null,
        screenshot_url: screenshotUrls[0] || null,
        problem: cleanData.problem || null,
        how: cleanData.how || null,
        features: cleanData.features?.length ? cleanData.features : null,
        tags: cleanData.tags?.length ? cleanData.tags : null,
      }

      if (editingProject === 'new') {
        const { data: created, error } = await supabase
          .from('projects')
          .insert({ ...dbData, builder_id: user.id })
          .select()
          .single()

        if (error) throw error
        if (created) setProjects(prev => [...prev, normalizeProject(created)])
      } else {
        const { error } = await supabase.from('projects').update(dbData).eq('id', editingProject.id)
        if (error) throw error
        setProjects(prev =>
          prev.map(p => p.id === editingProject.id ? { ...editingProject, ...cleanData, screenshots: screenshotUrls } : p)
        )
      }
      setEditingProject(null)
    } catch (error) {
      console.error(error)
      alert('Hubo un error al guardar el proyecto. Por favor, inténtalo de nuevo.')
    }
  }

  async function handleDeleteProject(id) {
    if (!window.confirm('¿Seguro que quieres eliminar este proyecto?')) return
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error(error)
      alert('Hubo un error al eliminar el proyecto.')
    }
  }

  async function handleMoveProject(project, direction) {
    const nonFeatured = [...projects]
      .filter(p => !p.featured)
      .sort((a, b) => a.order_index - b.order_index)
    const idx = nonFeatured.findIndex(p => p.id === project.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= nonFeatured.length) return

    const a = nonFeatured[idx]
    const b = nonFeatured[swapIdx]
    const aOrder = idx
    const bOrder = swapIdx

    try {
      await Promise.all([
        supabase.from('projects').update({ order_index: bOrder }).eq('id', a.id),
        supabase.from('projects').update({ order_index: aOrder }).eq('id', b.id),
      ])
      setProjects(prev => prev.map(p => {
        if (p.id === a.id) return { ...p, order_index: bOrder }
        if (p.id === b.id) return { ...p, order_index: aOrder }
        return p
      }))
    } catch {
      alert('Error al reordenar.')
    }
  }

  async function handleFeatureProject(project) {
    const newFeatured = !project.featured
    try {
      if (newFeatured) {
        await supabase.from('projects').update({ featured: false }).eq('builder_id', user.id)
      }
      const { error } = await supabase.from('projects').update({ featured: newFeatured }).eq('id', project.id)
      if (error) throw error
      setProjects(prev => prev.map(p => ({
        ...p,
        featured: newFeatured ? p.id === project.id : (p.id === project.id ? false : p.featured),
      })))
    } catch {
      alert('Error al actualizar el proyecto.')
    }
  }

  async function handlePublish() {
    const { error } = await supabase.from('builders').update({ published: true }).eq('id', user.id)
    if (error) { alert('Error al publicar. Inténtalo de nuevo.'); return }
    setIsPublished(true)
  }

  function handleCopy() {
    navigator.clipboard.writeText(`https://builders.es/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loadingBuilder) return null

  if (!builder) {
    return (
      <section className="section" style={{ paddingTop: '100px' }}>
        <div className="section-inner section-inner--narrow" style={{ textAlign: 'center' }}>
          <Link to="/" className="back-link">← Builders</Link>
          <p style={{ marginTop: 32, color: 'var(--text-secondary)' }}>Builder no encontrado.</p>
        </div>
      </section>
    )
  }

  const liveCount = displayProjects.filter(p => p.status === 'live').length

  if (isEditing) {
    return (
      <section className="profile-edit-section" style={{ paddingTop: '100px' }}>
        <div className="section-inner section-inner--narrow">
          <ProfileForm
            profile={editProfile}
            onChange={setEditProfile}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </section>
    )
  }

  const contactHref = builder.links?.linkedin || builder.links?.web || null

  return (
    <>
      <div className="profile-header" style={{ marginTop: 0 }}>
        <div className="profile-cover">
          <div className="profile-avatar">
            {builder.avatar ? (
              <img src={builder.avatar} alt={builder.name} />
            ) : (
              builder.name.charAt(0)
            )}
          </div>
        </div>
        
        <div className="profile-info">
          <div>
            <div className="profile-name-row">
              <h1 className="profile-name">{builder.name}</h1>
              {builder.location && <span className="profile-location">{builder.location}</span>}
            </div>
            <p className="profile-bio">{builder.bio}</p>
            <div className="profile-meta-row">
              <span>{displayProjects.length} {displayProjects.length === 1 ? 'proyecto' : 'proyectos'}</span>
              {liveCount > 0 && <><span className="profile-meta-sep">·</span><span>{liveCount} en vivo</span></>}
              {builder.createdAt && <><span className="profile-meta-sep">·</span><span>Builder desde {new Date(builder.createdAt).getFullYear()}</span></>}
            </div>
            {(builder.links?.linkedin || builder.links?.github || builder.links?.web) && (
              <div className="profile-social-links">
                {builder.links.linkedin && (
                  <a href={builder.links.linkedin} target="_blank" rel="noopener noreferrer" className="profile-social-link" aria-label="LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                )}
                {builder.links.github && (
                  <a href={builder.links.github} target="_blank" rel="noopener noreferrer" className="profile-social-link" aria-label="GitHub">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                )}
                {builder.links.web && (
                  <a href={builder.links.web} target="_blank" rel="noopener noreferrer" className="profile-social-link" aria-label="Web">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            {isOwner ? (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {!isPublished && (
                  <button className="btn btn-accent" onClick={handlePublish}>Publicar perfil</button>
                )}
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Editar perfil</button>
              </div>
            ) : (
              contactHref && <a href={contactHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Contactar</a>
            )}
            {isOwner && <button className="profile-url-row" onClick={handleCopy} title="Copiar link del perfil">
              <span>builders.es/{slug}</span>
              <span className="profile-url-copy">
                {copied ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </span>
              {copied && <span style={{ color: 'var(--accent-color)', fontSize: '0.75rem' }}>Copiado</span>}
            </button>}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          {editingProject !== null ? (
            <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <ProjectForm
                initial={editingProject === 'new' ? null : editingProject}
                onSave={handleSaveProject}
                onCancel={() => setEditingProject(null)}
              />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="profile-section-title" style={{ margin: 0 }}>Proyectos</h2>
                {isOwner && (
                  <button className="btn btn-primary" onClick={() => setEditingProject('new')}>
                    Añadir proyecto
                  </button>
                )}
              </div>
              
              {displayProjects.length === 0 && !isOwner ? (
                <p style={{ color: 'var(--text-secondary)' }}>Aún no hay proyectos publicados.</p>
              ) : (
                <div style={{ paddingBottom: '2rem' }}>
                  {(() => {
                    const featuredProject = displayProjects[0]?.featured ? displayProjects[0] : null
                    const gridProjects = featuredProject ? displayProjects.slice(1) : displayProjects
                    return (
                      <>
                        {featuredProject && (
                          <div className="project-owner-wrap" style={{ marginBottom: '1.5rem' }}>
                            <div
                              className="project-hero"
                              onClick={() => setActiveProject({...featuredProject, builder})}
                              style={{ backgroundImage: featuredProject.screenshots?.[0] ? `url(${featuredProject.screenshots[0]})` : undefined }}
                            >
                              <div className="project-hero-overlay" />
                              <div className="project-hero-content">
                                <span className="project-hero-status">{featuredProject.status === 'live' ? 'En vivo' : featuredProject.status === 'development' ? 'En desarrollo' : 'Demo'}</span>
                                <h3 className="project-hero-title">{featuredProject.name}</h3>
                                <p className="project-hero-tagline">{featuredProject.tagline}</p>
                                <div className="project-hero-actions">
                                  <button className="btn btn-primary">Ver proyecto</button>
                                  {featuredProject.url && (
                                    <a href={featuredProject.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" onClick={e => e.stopPropagation()}>Abrir</a>
                                  )}
                                </div>
                              </div>
                            </div>
                            {isOwner && (
                              <div className="project-owner-controls" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
                                <button className={`btn-pin btn-pin--active`} onClick={() => handleFeatureProject(featuredProject)}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  Destacado
                                </button>
                                <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => setEditingProject(featuredProject)}>Editar</button>
                                <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => handleDeleteProject(featuredProject.id)}>Eliminar</button>
                              </div>
                            )}
                          </div>
                        )}

                        {gridProjects.length > 0 && (
                          <div className="profile-projects-grid">
                            {gridProjects.map((project, idx) => (
                              <div key={project.id} className="project-owner-wrap">
                                <FeedCard
                                  project={{...project, builder}}
                                  onClick={() => setActiveProject({...project, builder})}
                                  hideBuilder
                                />
                                {isOwner && (
                                  <div className="project-owner-controls" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <button className="btn-move" onClick={() => handleMoveProject(project, 'up')} disabled={idx === 0} title="Subir">
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
                                    </button>
                                    <button className="btn-move" onClick={() => handleMoveProject(project, 'down')} disabled={idx === gridProjects.length - 1} title="Bajar">
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
                                    </button>
                                    <button className={`btn-pin ${project.featured ? 'btn-pin--active' : ''}`} onClick={() => handleFeatureProject(project)}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                      Destacar
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => setEditingProject(project)}>Editar</button>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => handleDeleteProject(project.id)}>Eliminar</button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              )}
            </>
          )}
        </div>
        
        <aside className="profile-sidebar">
          {builder.background && (
            <>
              <h2 className="profile-section-title">Background</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                {builder.background}
              </p>
            </>
          )}

          {builder.stack && builder.stack.length > 0 && (
            <>
              <h2 className="profile-section-title">Stack</h2>
              {builder.stack.map(group => (
                <div key={group.category} className="stack-group">
                  <h4 className="stack-group-title">{group.category}</h4>
                  <div className="tags" style={{ padding: 0 }}>
                    {group.items.map(item => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </aside>
      </div>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </>
  )
}

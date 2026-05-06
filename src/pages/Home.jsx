import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { builders as staticBuilders } from '../data/builders'
import { supabase } from '../lib/supabase'
import FeedCard from '../components/FeedCard'
import BuilderCard from '../components/BuilderCard'
import BuilderMap from '../components/BuilderMap'
import ProjectModal from '../components/ProjectModal'

function normalizeSupabaseBuilder(b) {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    bio: b.bio || '',
    background: '',
    location: b.location || '',
    labels: b.labels || [],
    sectors: b.sectors || [],
    avatar: b.avatar_url,
    links: b.links || {},
    stack: [],
    stats: { followers: 0, following: 0 },
    projects: (b.projects || []).map(p => ({
      id: p.id,
      name: p.title,
      tagline: p.description || '',
      status: p.status,
      url: p.url,
      screenshots: p.screenshot_url ? [p.screenshot_url] : [],
      tags: b.sectors || [],
      features: [],
    })),
  }
}

const FILTERS = [
  'Todos',
  'Finanzas', 'Educación', 'Comercio', 'Salud', 'Inmobiliaria', 
  'Logística', 'Turismo', 'Hostelería', 'Agricultura', 'Legal', 'Construcción'
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [activeProject, setActiveProject] = useState(null)
  const [dynamicBuilders, setDynamicBuilders] = useState([])
  const [activeView, setActiveView] = useState('proyectos')

  useEffect(() => {
    supabase
      .from('builders')
      .select('*, projects(*)')
      .eq('published', true)
      .then(({ data }) => {
        if (data) setDynamicBuilders(data.map(normalizeSupabaseBuilder))
      })
  }, [])

  const allBuilders = useMemo(() => {
    const dynamicSlugs = new Set(dynamicBuilders.map(b => b.slug))
    const newStatic = staticBuilders.filter(b => !dynamicSlugs.has(b.slug))
    return [...newStatic, ...dynamicBuilders]
  }, [dynamicBuilders])

  const allProjects = useMemo(
    () => allBuilders.flatMap(b => b.projects.map(p => ({ ...p, builder: b }))),
    [allBuilders]
  )

  const filteredBuilders = useMemo(() => {
    const q = search.toLowerCase()
    return allBuilders.filter(b => {
      const matchesSearch = q === '' ||
        b.name.toLowerCase().includes(q) ||
        b.bio.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.labels.some(l => l.toLowerCase().includes(q))
      const matchesFilter = activeFilter === 'Todos' ||
        b.labels.includes(activeFilter) ||
        b.sectors?.includes(activeFilter)
      return matchesSearch && matchesFilter
    })
  }, [search, activeFilter, allBuilders])

  const filtered = useMemo(() => {
    return allProjects.filter(p => {
      const q = search.toLowerCase()
      const matchesSearch =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.builder.name.toLowerCase().includes(q)

      const matchesFilter =
        activeFilter === 'Todos' ||
        p.tags.includes(activeFilter) ||
        p.builder.labels.includes(activeFilter)

      return matchesSearch && matchesFilter
    })
  }, [search, activeFilter, allProjects])

  return (
    <>
      <section className="feed-hero">
        <p className="feed-hero-label animate-reveal" style={{ animationDelay: '0s' }}>La comunidad</p>
        <h1 className="feed-hero-title animate-reveal" style={{ animationDelay: '0.1s' }}>
          El portfolio de los <span style={{ color: 'var(--accent-color)' }}>builders</span>
        </h1>
        <p className="feed-hero-sub animate-reveal" style={{ animationDelay: '0.3s' }}>
          Descubre proyectos. Conecta con los que construyen como tú.
        </p>

        <div className="search-container animate-reveal" style={{ animationDelay: '0.5s' }}>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Busca proyectos, tecnologías, creadores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="filter-pills">
            {FILTERS.map(tag => (
              <button 
                key={tag}
                className={`filter-pill ${activeFilter === tag ? 'active' : ''}`}
                onClick={() => setActiveFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="feed-section">
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${activeView === 'proyectos' ? 'active' : ''}`}
            onClick={() => setActiveView('proyectos')}
          >
            Proyectos
          </button>
          <button
            className={`view-toggle-btn ${activeView === 'builders' ? 'active' : ''}`}
            onClick={() => setActiveView('builders')}
          >
            Builders
          </button>
        </div>

        {activeView === 'proyectos' ? (
          filtered.length === 0 ? (
            <div className="feed-empty">
              <p>No hay proyectos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="feed-grid">
              {filtered.map(project => (
                <FeedCard
                  key={`${project.builder.id}-${project.id}`}
                  project={project}
                  onClick={() => setActiveProject(project)}
                />
              ))}
            </div>
          )
        ) : (
          <>
            <BuilderMap builders={allBuilders} />
            {filteredBuilders.length === 0 ? (
              <div className="feed-empty">
                <p>No hay builders que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              <div className="builders-grid">
                {filteredBuilders.map(b => (
                  <BuilderCard key={b.id} builder={b} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </>
  )
}

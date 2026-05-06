import { useState, useRef } from 'react'
import BuilderAvatar from './BuilderAvatar'

const LABEL_OPTIONS = [
  'Fundador',
  'Desarrollador',
  'Diseñador',
  'Emprendedor',
  'Ingeniero',
  'Creador independiente',
  'Científico de datos',
]

const SECTORS = [
  'Educación', 'Finanzas', 'Salud', 'Comercio', 'Viajes',
  'Alimentación', 'Legal', 'Inmobiliario', 'Marketing', 'Recursos Humanos',
  'Logística', 'Productividad', 'Entretenimiento', 'Deportes', 'Medio ambiente',
]

const TECH_CATALOG = {
  'Frontend':      ['React', 'Next.js', 'Vue', 'Svelte', 'TypeScript', 'HTML / CSS', 'Tailwind', 'Vite'],
  'Backend':       ['Node.js', 'Python', 'FastAPI', 'Django', 'Express', 'Go', 'Rails', 'PHP'],
  'Base de datos': ['Supabase', 'Firebase', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis'],
  'IA':            ['Claude AI', 'OpenAI API', 'LangChain', 'Anthropic API', 'Hugging Face', 'Replicate'],
  'Herramientas':  ['Git', 'Figma', 'VS Code', 'Vercel', 'AWS', 'Docker', 'GitHub Actions', 'Linear'],
  'Finanzas':      ['Modelado financiero', 'SaaS metrics', 'Unit economics'],
}

function flattenStack(stack) {
  return (stack || []).flatMap(s => s.items || [])
}

function buildStack(techs) {
  const lookup = {}
  Object.entries(TECH_CATALOG).forEach(([cat, items]) => {
    items.forEach(item => { lookup[item] = cat })
  })
  const grouped = {}
  const custom = []
  techs.forEach(tech => {
    const cat = lookup[tech]
    if (cat) {
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(tech)
    } else {
      custom.push(tech)
    }
  })
  const result = Object.entries(grouped).map(([category, items]) => ({ category, items }))
  if (custom.length) result.push({ category: 'Otros', items: custom })
  return result
}

export default function ProfileForm({ profile, onChange, onSave, onCancel }) {
  const [saved, setSaved] = useState(false)
  const [techSearch, setTechSearch] = useState('')
  const [customTech, setCustomTech] = useState('')
  const avatarInputRef = useRef(null)

  const selectedTechs = flattenStack(profile.stack)

  function set(key, value) {
    onChange(prev => ({ ...prev, [key]: value }))
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    onChange(prev => ({ ...prev, avatar: URL.createObjectURL(file), _avatarFile: file }))
    e.target.value = ''
  }

  function setLink(key, value) {
    onChange(prev => ({ ...prev, links: { ...prev.links, [key]: value } }))
  }

  function toggleChip(list, key, item) {
    const next = list.includes(item) ? list.filter(x => x !== item) : [...list, item]
    set(key, next)
  }

  function toggleTech(tech) {
    const next = selectedTechs.includes(tech)
      ? selectedTechs.filter(t => t !== tech)
      : [...selectedTechs, tech]
    set('stack', buildStack(next))
  }

  function addCustomTech() {
    const tech = customTech.trim()
    if (!tech || selectedTechs.includes(tech)) return
    set('stack', buildStack([...selectedTechs, tech]))
    setCustomTech('')
  }

  function handleSave(e) {
    e.preventDefault()
    onSave?.()
    if (!onCancel) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const filteredCatalog = techSearch.trim()
    ? Object.fromEntries(
        Object.entries(TECH_CATALOG)
          .map(([cat, items]) => [cat, items.filter(i => i.toLowerCase().includes(techSearch.toLowerCase()))])
          .filter(([, items]) => items.length)
      )
    : TECH_CATALOG

  return (
    <form className="profile-form-edit" onSubmit={handleSave}>

      <div className="form-page-header">
        <h2 className="form-page-title">Edita tu perfil</h2>
        <div className="form-page-actions">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          )}
          <button type="submit" className="btn btn-primary">
            {saved ? '¡Guardado!' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* Avatar */}
      <div className="form-card-section">
        <div className="form-card form-card--avatar">
          <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          <div className="avatar-upload" onClick={() => avatarInputRef.current.click()}>
            <BuilderAvatar builder={{ name: profile.name, avatar: profile.avatar }} size={96} />
            <div className="avatar-upload-overlay">
              <span>{profile.avatar ? 'Cambiar' : 'Subir'}</span>
            </div>
          </div>
          <div className="form-avatar-actions">
            <button type="button" className="form-avatar-btn" onClick={() => avatarInputRef.current.click()}>
              {profile.avatar ? 'Cambiar foto' : 'Añadir foto de perfil'}
            </button>
            {profile.avatar && (
              <button type="button" className="form-avatar-btn form-avatar-btn--danger" onClick={() => onChange(prev => ({ ...prev, avatar: null, _avatarFile: null }))}>
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lo básico */}
      <div className="form-card-section">
        <p className="form-card-header">Lo básico</p>
        <div className="form-card">
          <div className="form-card-row">
            <label>Nombre</label>
            <input type="text" value={profile.name || ''} onChange={e => set('name', e.target.value)} placeholder="Tu nombre completo" />
          </div>
          <div className="form-card-row">
            <label>Una frase que te defina</label>
            <input
              type="text"
              value={profile.bio || ''}
              onChange={e => set('bio', e.target.value)}
              maxLength={160}
              placeholder="Builder de productos financieros con IA..."
            />
            <span className="form-card-hint">{(profile.bio || '').length}/160</span>
          </div>
          <div className="form-card-row">
            <label>¿Dónde estás?</label>
            <input type="text" value={profile.location || ''} onChange={e => set('location', e.target.value)} placeholder="Madrid, España" />
          </div>
        </div>
      </div>

      {/* Tu historia */}
      <div className="form-card-section">
        <p className="form-card-header">Tu historia</p>
        <p className="form-card-subheader">¿De dónde vienes y qué te llevó a construir?</p>
        <div className="form-card">
          <div className="form-card-row">
            <textarea
              value={profile.background || ''}
              onChange={e => set('background', e.target.value)}
              rows={4}
              placeholder="Soy ingeniero con 5 años en banca. Vi de primera mano cómo las startups perdían semanas en Excel y decidí construir la solución..."
            />
          </div>
        </div>
      </div>

      {/* ¿Cómo te defines? */}
      <div className="form-card-section">
        <p className="form-card-header">¿Cómo te defines?</p>
        <p className="form-card-subheader">Selecciona todo lo que encaje contigo</p>
        <div className="form-chip-grid">
          {LABEL_OPTIONS.map(label => (
            <button
              key={label}
              type="button"
              className={`form-chip${(profile.labels || []).includes(label) ? ' selected' : ''}`}
              onClick={() => toggleChip(profile.labels || [], 'labels', label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ¿En qué sectores te mueves? */}
      <div className="form-card-section">
        <p className="form-card-header">¿En qué sectores te mueves?</p>
        <p className="form-card-subheader">Donde tus proyectos tienen más impacto</p>
        <div className="form-chip-grid">
          {SECTORS.map(sector => (
            <button
              key={sector}
              type="button"
              className={`form-chip${(profile.sectors || []).includes(sector) ? ' selected' : ''}`}
              onClick={() => toggleChip(profile.sectors || [], 'sectors', sector)}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* ¿Con qué construyes? */}
      <div className="form-card-section">
        <p className="form-card-header">¿Con qué construyes?</p>
        <p className="form-card-subheader">Haz clic para añadir — o busca si no la ves</p>

        {selectedTechs.length > 0 && (
          <div className="form-selected-techs">
            {selectedTechs.map(tech => (
              <span key={tech} className="tag-chip">
                {tech}
                <button type="button" className="tag-chip-remove" onClick={() => toggleTech(tech)}>×</button>
              </span>
            ))}
          </div>
        )}

        <input
          type="text"
          className="form-tech-search"
          placeholder="Buscar tecnología..."
          value={techSearch}
          onChange={e => setTechSearch(e.target.value)}
        />

        <div className="form-tech-catalog">
          {Object.entries(filteredCatalog).map(([cat, items]) => (
            <div key={cat} className="form-tech-group">
              <span className="form-tech-group-label">{cat}</span>
              <div className="form-chip-grid form-chip-grid--compact">
                {items.map(tech => (
                  <button
                    key={tech}
                    type="button"
                    className={`form-chip form-chip--sm${selectedTechs.includes(tech) ? ' selected' : ''}`}
                    onClick={() => toggleTech(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="form-custom-tech">
          <input
            type="text"
            placeholder="¿No está en la lista? Escríbela aquí..."
            value={customTech}
            onChange={e => setCustomTech(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTech() } }}
          />
          <button type="button" className="btn btn-secondary" onClick={addCustomTech}>Añadir</button>
        </div>
      </div>

      {/* ¿Dónde encontrarte? */}
      <div className="form-card-section">
        <p className="form-card-header">¿Dónde encontrarte?</p>
        <div className="form-card">
          <div className="form-card-row">
            <label>LinkedIn</label>
            <input type="url" value={profile.links?.linkedin || ''} onChange={e => setLink('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="form-card-row">
            <label>GitHub</label>
            <input type="url" value={profile.links?.github || ''} onChange={e => setLink('github', e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className="form-card-row">
            <label>Web personal</label>
            <input type="url" value={profile.links?.web || ''} onChange={e => setLink('web', e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </div>

    </form>
  )
}

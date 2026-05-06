import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BuilderAvatar from '../components/BuilderAvatar'
import { useAuth } from '../context/AuthContext'
import { supabase, uploadAvatar, uploadScreenshot } from '../lib/supabase'
import { formatUrl } from '../lib/utils'

const STEP_TITLES = ['Tu identidad', 'Tus sectores', 'Tus links', 'Tu primer proyecto']
const STEP_SUBS = [
  'Lo básico para que te conozcan.',
  '¿En qué sectores se mueven tus proyectos?',
  '¿Dónde pueden encontrarte?',
  'Opcional — puedes añadirlo después desde el dashboard.',
]

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

const PROJECT_STATUSES = [
  { value: 'live',        label: 'En vivo — ya está funcionando' },
  { value: 'demo',        label: 'Demo — hay algo para ver' },
  { value: 'development', label: 'En desarrollo — trabajo en progreso' },
]

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'builder'
}

async function ensureUniqueSlug(base) {
  let slug = base
  let n = 2
  for (;;) {
    const { data } = await supabase.from('builders').select('slug').eq('slug', slug).maybeSingle()
    if (!data) return slug
    slug = `${base}-${n++}`
  }
}

export default function Setup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const avatarInputRef = useRef(null)
  const screenshotInputRef = useRef(null)

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [name, setName] = useState(user?.user_metadata?.name || '')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [labels, setLabels] = useState([])

  const [sectors, setSectors] = useState([])
  const [links, setLinks] = useState({ linkedin: '', github: '', web: '' })
  const [project, setProject] = useState({ name: '', description: '', status: 'development', url: '' })
  const [screenshotFiles, setScreenshotFiles] = useState([])
  const [screenshotPreviews, setScreenshotPreviews] = useState([])

  useEffect(() => {
    if (!user) return
    supabase.from('builders').select('id').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (data) navigate('/dashboard', { replace: true })
    })
  }, [user, navigate])

  function handleAvatarChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  function handleScreenshots(e) {
    const files = Array.from(e.target.files)
    setScreenshotFiles(prev => [...prev, ...files])
    setScreenshotPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  function removeScreenshot(i) {
    URL.revokeObjectURL(screenshotPreviews[i])
    setScreenshotFiles(prev => prev.filter((_, idx) => idx !== i))
    setScreenshotPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  function toggleChip(list, setList, item) {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item])
  }

  function goNext(e) {
    e?.preventDefault()
    setStep(s => s + 1)
    window.scrollTo(0, 0)
  }

  function goBack() {
    setStep(s => s - 1)
    window.scrollTo(0, 0)
  }

  async function saveAndGo(withProject = true) {
    setSaving(true)
    setSaveError('')
    try {
      const slug = await ensureUniqueSlug(generateSlug(name))

      let avatarUrl = null
      if (avatarFile) avatarUrl = await uploadAvatar(user.id, avatarFile)

      const { error: builderErr } = await supabase.from('builders').insert({
        id: user.id,
        slug,
        name,
        bio,
        location: location || null,
        avatar_url: avatarUrl,
        sectors,
        labels,
        links: Object.fromEntries(
          Object.entries(links)
            .map(([k, v]) => [k, formatUrl(v)])
            .filter(([, v]) => v)
        ),
        published: false,
      })
      if (builderErr) throw builderErr

      if (withProject && project.name) {
        let screenshotUrl = null
        if (screenshotFiles[0]) screenshotUrl = await uploadScreenshot(user.id, screenshotFiles[0])

        const { error: projectErr } = await supabase.from('projects').insert({
          builder_id: user.id,
          title: project.name,
          description: project.description || null,
          status: project.status,
          url: formatUrl(project.url) || null,
          screenshot_url: screenshotUrl,
        })
        if (projectErr) throw projectErr
      }

      navigate('/dashboard')
    } catch {
      setSaveError('Error al guardar. Inténtalo de nuevo.')
      setSaving(false)
    }
  }

  function handleFinish(e) {
    e.preventDefault()
    saveAndGo(true)
  }

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back">Builders</Link>

      <div className="setup-card">
        <div className="setup-progress">
          {[1, 2, 3, 4].map((n, i) => (
            <div key={n} className="setup-progress-item">
              <div className={`setup-step-dot${step >= n ? ' active' : ''}${step === n ? ' current' : ''}`}>
                {step > n ? (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : n}
              </div>
              {i < 3 && <div className={`setup-step-line${step > n ? ' active' : ''}`} />}
            </div>
          ))}
        </div>

        <div key={step} className="setup-step-content">
          <h1 className="auth-card-title">{STEP_TITLES[step - 1]}</h1>
          <p className="auth-card-sub">{STEP_SUBS[step - 1]}</p>

          {step === 1 && (
            <form className="auth-form" onSubmit={goNext}>
              <div className="setup-avatar-row">
                <div className="avatar-upload" onClick={() => avatarInputRef.current.click()}>
                  <BuilderAvatar builder={{ name: name || '?', avatar: avatarPreview }} size={72} />
                  <div className="avatar-upload-overlay">
                    <span>{avatarPreview ? 'Cambiar' : 'Foto'}</span>
                  </div>
                  <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </div>
                <div>
                  <p className="setup-avatar-label">{avatarPreview ? 'Foto añadida' : 'Añadir foto de perfil'}</p>
                  <p className="setup-avatar-hint">Opcional · JPG o PNG</p>
                </div>
              </div>

              <div className="form-group">
                <label>Nombre completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required />
              </div>

              <div className="form-group">
                <label>Bio corta</label>
                <input
                  type="text"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Builder de productos con IA..."
                  maxLength={160}
                  required
                />
                <span className="form-hint">{bio.length}/160</span>
              </div>

              <div className="form-group">
                <label>Ubicación <span className="setup-optional">— opcional</span></label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Madrid, España" />
              </div>

              <div className="form-group">
                <label>¿Cómo te defines? <span className="setup-optional">— opcional</span></label>
                <div className="setup-chip-group">
                  {LABEL_OPTIONS.map(l => (
                    <button
                      key={l}
                      type="button"
                      className={`setup-chip${labels.includes(l) ? ' selected' : ''}`}
                      onClick={() => toggleChip(labels, setLabels, l)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary auth-submit">Continuar →</button>
            </form>
          )}

          {step === 2 && (
            <form className="auth-form" onSubmit={goNext}>
              <div className="setup-chip-group">
                {SECTORS.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`setup-chip setup-chip--sector${sectors.includes(s) ? ' selected' : ''}`}
                    onClick={() => toggleChip(sectors, setSectors, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="setup-actions">
                <button type="button" className="btn-secondary" onClick={goBack}>← Atrás</button>
                <button type="submit" className="btn-primary setup-submit">Continuar →</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="auth-form" onSubmit={goNext}>
              <div className="form-group">
                <label>LinkedIn</label>
                <input type="url" value={links.linkedin} onChange={e => setLinks(l => ({ ...l, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="form-group">
                <label>GitHub</label>
                <input type="url" value={links.github} onChange={e => setLinks(l => ({ ...l, github: e.target.value }))} placeholder="https://github.com/..." />
              </div>
              <div className="form-group">
                <label>Web personal</label>
                <input type="url" value={links.web} onChange={e => setLinks(l => ({ ...l, web: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="setup-actions">
                <button type="button" className="btn-secondary" onClick={goBack}>← Atrás</button>
                <button type="submit" className="btn-primary setup-submit">Continuar →</button>
              </div>
              <button type="button" className="setup-skip" onClick={goNext}>Saltar este paso</button>
            </form>
          )}

          {step === 4 && (
            <form className="auth-form" onSubmit={handleFinish}>
              <div className="form-group">
                <label>¿Cómo se llama?</label>
                <input type="text" value={project.name} onChange={e => setProject(p => ({ ...p, name: e.target.value }))} placeholder="Vontury, EduBot, AutoStock..." />
              </div>

              <div className="form-group">
                <label>¿Qué hace, en una frase?</label>
                <input type="text" value={project.description} onChange={e => setProject(p => ({ ...p, description: e.target.value }))} placeholder="Copiloto financiero con IA para startups." maxLength={120} />
              </div>

              <div className="form-group">
                <label>¿En qué estado está?</label>
                <div className="setup-radio-group">
                  {PROJECT_STATUSES.map(s => (
                    <label key={s.value} className={`setup-radio${project.status === s.value ? ' selected' : ''}`}>
                      <input type="radio" name="status" value={s.value} checked={project.status === s.value} onChange={() => setProject(p => ({ ...p, status: s.value }))} />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Imágenes <span className="setup-optional">— opcional</span></label>
                <input ref={screenshotInputRef} type="file" accept="image/*" multiple hidden onChange={handleScreenshots} />
                {screenshotPreviews.length === 0 ? (
                  <button type="button" className="setup-upload-zone" onClick={() => screenshotInputRef.current.click()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span>Subir capturas del proyecto</span>
                    <span className="setup-upload-hint">PNG, JPG · Puedes subir varias</span>
                  </button>
                ) : (
                  <div className="setup-screenshots">
                    {screenshotPreviews.map((url, i) => (
                      <div key={i} className="setup-screenshot-thumb">
                        <img src={url} alt="" />
                        <button type="button" className="screenshot-remove" onClick={() => removeScreenshot(i)}>×</button>
                      </div>
                    ))}
                    <button type="button" className="setup-screenshot-add" onClick={() => screenshotInputRef.current.click()}>+</button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>URL <span className="setup-optional">— opcional</span></label>
                <input type="url" value={project.url} onChange={e => setProject(p => ({ ...p, url: e.target.value }))} placeholder="https://..." />
              </div>

              {saveError && <p className="auth-error">{saveError}</p>}

              <div className="setup-actions">
                <button type="button" className="btn-secondary" onClick={goBack}>← Atrás</button>
                <button type="submit" className="btn-primary setup-submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Publicar perfil →'}
                </button>
              </div>

              <button type="button" className="setup-skip" onClick={() => saveAndGo(false)} disabled={saving}>
                Saltar — añadiré proyectos después
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

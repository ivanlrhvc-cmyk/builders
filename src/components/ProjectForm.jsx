import { useState, useRef } from 'react'
import { STATUSES } from '../data/constants'

function empty() {
  return {
    name: '', status: 'development', tagline: '',
    description: '', tags: [], url: '',
    problem: '', how: '', features: [], screenshots: [],
  }
}

export default function ProjectForm({ initial, onSave, onCancel }) {
  const [data, setData] = useState(
    initial
      ? { ...initial, tags: [...initial.tags], features: initial.features.map((f) => ({ ...f })), screenshots: [...(initial.screenshots || [])] }
      : empty()
  )
  const [screenshotFiles, setScreenshotFiles] = useState(
    (initial?.screenshots || []).map(() => null)
  )
  const [newTag, setNewTag] = useState('')
  const [newFeature, setNewFeature] = useState({ title: '', description: '' })
  const screenshotInputRef = useRef(null)

  function set(key, value) { setData((prev) => ({ ...prev, [key]: value })) }

  function addTag() {
    const tag = newTag.trim()
    if (!tag || data.tags.includes(tag)) return
    set('tags', [...data.tags, tag])
    setNewTag('')
  }

  function removeTag(tag) { set('tags', data.tags.filter((t) => t !== tag)) }

  function addFeature() {
    if (!newFeature.title.trim()) return
    set('features', [...data.features, { ...newFeature }])
    setNewFeature({ title: '', description: '' })
  }

  function removeFeature(i) { set('features', data.features.filter((_, idx) => idx !== i)) }

  function handleScreenshots(e) {
    const files = Array.from(e.target.files)
    set('screenshots', [...data.screenshots, ...files.map(f => URL.createObjectURL(f))])
    setScreenshotFiles(prev => [...prev, ...files])
    e.target.value = ''
  }

  function removeScreenshot(i) {
    if (screenshotFiles[i]) URL.revokeObjectURL(data.screenshots[i])
    set('screenshots', data.screenshots.filter((_, idx) => idx !== i))
    setScreenshotFiles(prev => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ ...data, _screenshotFiles: screenshotFiles })
  }

  return (
    <form className="project-form-edit" onSubmit={handleSubmit}>

      <div className="form-page-header">
        <h2 className="form-page-title">{initial ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
        <div className="form-page-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn-primary">Guardar</button>
        </div>
      </div>

      {/* ── Lo esencial ── */}
      <div className="form-card-section">
        <p className="form-card-header">Lo esencial</p>
        <div className="form-card">
          <div className="form-card-row">
            <label>Nombre del proyecto</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Vontury, EduBot, AutoStock..."
              required
            />
          </div>
          <div className="form-card-row">
            <label>Tagline</label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => set('tagline', e.target.value)}
              placeholder="Una frase que lo resume todo."
              maxLength={120}
            />
          </div>
          <div className="form-card-row">
            <label>Estado</label>
            <select value={data.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="form-card-row">
            <label>URL del proyecto</label>
            <input
              type="url"
              value={data.url || ''}
              onChange={(e) => set('url', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* ── Imágenes ── */}
      <div className="form-card-section">
        <p className="form-card-header">Imágenes</p>
        <div className="form-card">
          <input ref={screenshotInputRef} type="file" accept="image/*" multiple hidden onChange={handleScreenshots} />
          {data.screenshots.length === 0 ? (
            <div className="form-card-row">
              <button
                type="button"
                className="form-upload-zone"
                onClick={() => screenshotInputRef.current.click()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span>Subir capturas del proyecto</span>
                <span className="form-upload-hint">PNG, JPG · Puedes subir varias</span>
              </button>
            </div>
          ) : (
            <div className="form-card-row form-card-row--screenshots">
              {data.screenshots.map((url, i) => (
                <div key={i} className="screenshot-thumb">
                  <img src={url} alt="" />
                  <button type="button" className="screenshot-remove" onClick={() => removeScreenshot(i)}>×</button>
                </div>
              ))}
              <button
                type="button"
                className="screenshot-add-btn"
                onClick={() => screenshotInputRef.current.click()}
              >
                + Añadir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Sobre el proyecto ── */}
      <div className="form-card-section">
        <p className="form-card-header">Sobre el proyecto</p>
        <div className="form-card">
          <div className="form-card-row">
            <label>Descripción</label>
            <textarea
              value={data.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="¿De qué va el proyecto?"
            />
          </div>
          <div className="form-card-row">
            <label>Problema que resuelve</label>
            <textarea
              value={data.problem}
              onChange={(e) => set('problem', e.target.value)}
              rows={3}
              placeholder="¿Qué problema existe y por qué importa?"
            />
          </div>
          <div className="form-card-row">
            <label>Cómo funciona</label>
            <textarea
              value={data.how}
              onChange={(e) => set('how', e.target.value)}
              rows={3}
              placeholder="¿Cuál es la solución y cómo la resuelve?"
            />
          </div>
        </div>
      </div>

      {/* ── Tecnologías ── */}
      <div className="form-card-section">
        <p className="form-card-header">Stack / Tecnologías</p>
        <div className="form-card">
          <div className="form-card-row form-card-row--chips">
            {data.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
                <button type="button" className="tag-chip-remove" onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
            <div className="tag-add">
              <input
                type="text"
                placeholder="Añadir tecnología"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              />
              <button type="button" onClick={addTag}>+</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Funcionalidades ── */}
      <div className="form-card-section">
        <p className="form-card-header">Funcionalidades</p>
        <div className="form-card">
          {data.features.map((f, i) => (
            <div key={i} className="form-card-row form-card-row--feature">
              <div className="form-feature-info">
                <span className="form-feature-title">{f.title}</span>
                {f.description && <span className="form-feature-desc">{f.description}</span>}
              </div>
              <button type="button" className="form-feature-remove" onClick={() => removeFeature(i)}>×</button>
            </div>
          ))}
          <div className="form-card-row form-card-row--add-feature">
            <div className="form-add-feature-inputs">
              <input
                type="text"
                placeholder="Nombre de la funcionalidad"
                value={newFeature.title}
                onChange={(e) => setNewFeature((p) => ({ ...p, title: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Descripción breve (opcional)"
                value={newFeature.description}
                onChange={(e) => setNewFeature((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <button type="button" className="form-add-feature-btn" onClick={addFeature}>
              + Añadir
            </button>
          </div>
        </div>
      </div>

    </form>
  )
}

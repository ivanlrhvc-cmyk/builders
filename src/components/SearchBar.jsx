export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        className="search-input"
        placeholder="Busca proyectos, tecnologías, sectores..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar proyectos"
      />
    </div>
  )
}

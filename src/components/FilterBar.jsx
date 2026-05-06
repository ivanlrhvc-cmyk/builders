export default function FilterBar({ tags, active, onChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filtrar proyectos">
      {tags.map((tag) => (
        <button
          key={tag}
          className={`filter-pill${active === tag ? ' filter-pill--active' : ''}`}
          onClick={() => onChange(tag)}
          aria-pressed={active === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

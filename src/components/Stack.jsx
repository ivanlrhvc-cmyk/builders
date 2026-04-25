const stack = [
  {
    category: 'IA',
    items: ['Claude AI', 'Anthropic API'],
  },
  {
    category: 'Frontend',
    items: ['React', 'Vite', 'HTML / CSS'],
  },
  {
    category: 'Backend',
    items: ['Supabase', 'Node.js', 'Vercel Edge Functions'],
  },
  {
    category: 'Finanzas',
    items: ['Modelado financiero', 'SaaS metrics', 'Unit economics'],
  },
  {
    category: 'Herramientas',
    items: ['Claude Code', 'VS Code', 'Vercel', 'Git / GitHub'],
  },
]

export default function Stack() {
  return (
    <section className="section section--alt" id="stack">
      <div className="section-inner">
        <div className="section-header">
          <h2 className="section-title">Stack & Habilidades</h2>
          <p className="section-sub">Con qué construyo</p>
        </div>
        <div className="stack-grid">
          {stack.map(({ category, items }) => (
            <div key={category} className="stack-group">
              <h3 className="stack-category">{category}</h3>
              <ul className="stack-items">
                {items.map((item) => (
                  <li key={item} className="stack-chip">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

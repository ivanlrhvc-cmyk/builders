export const builders = [
  {
    id: 'maria-gonzalez',
    slug: 'maria-gonzalez',
    name: 'María González',
    bio: 'Construyo herramientas educativas con IA que adaptan el aprendizaje a cada alumno en tiempo real.',
    background: 'Graduada en Pedagogía por la Universidad Complutense. Máster en Tecnología Educativa. Tres años trabajando en edtech antes de lanzar EduBot.',
    location: 'Madrid, España',
    labels: ['Builder', 'Educación', 'IA'],
    avatar: null,
    stats: { followers: 12, following: 4 },
    links: {
      linkedin: 'https://linkedin.com/in/mariagonzalez',
      github: 'https://github.com/mariagonzalez',
      web: null,
    },
    stack: [
      { category: 'IA',       items: ['Claude AI', 'OpenAI'] },
      { category: 'Frontend', items: ['React', 'Next.js'] },
      { category: 'Backend',  items: ['Supabase', 'Vercel'] },
    ],
    projects: [
      {
        id: 'edubot',
        name: 'EduBot',
        status: 'live',
        tagline: 'Tutor de matemáticas con IA para secundaria.',
        description:
          'Genera ejercicios personalizados, detecta los errores conceptuales del alumno y adapta el nivel automáticamente.',
        tags: ['Claude AI', 'React', 'Supabase', 'Educación'],
        url: 'https://edubot.app',
        problem:
          'Los profesores no tienen tiempo para dar atención individualizada a 30 alumnos con niveles distintos. Los alumnos con dificultades se quedan atrás sin que nadie lo detecte a tiempo.',
        how:
          'EduBot actúa como tutor personal disponible 24/7. Detecta patrones de error, explica los conceptos de forma adaptada y genera ejercicios progresivos hasta que el alumno domina cada bloque.',
        features: [
          { title: 'Diagnóstico inicial', description: 'Evalúa el nivel del alumno en 10 minutos y genera un plan personalizado.' },
          { title: 'Detección de errores', description: 'Identifica qué conceptos no están consolidados y los trabaja específicamente.' },
          { title: 'Ejercicios adaptativos', description: 'La dificultad sube o baja en tiempo real según las respuestas del alumno.' },
          { title: 'Informe para padres', description: 'Resumen semanal del progreso con recomendaciones concretas.' },
        ],
        screenshots: ['https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800'],
      },
    ],
  },
  {
    id: 'carlos-ruiz',
    slug: 'carlos-ruiz',
    name: 'Carlos Ruiz',
    bio: 'Automatizo operaciones de e-commerce para que los equipos puedan enfocarse en crecer, no en gestionar.',
    background: 'Ingeniero Informático por la UPC. Cinco años en operaciones de e-commerce en startups de Barcelona. Ahora construyo las herramientas que siempre eché en falta.',
    location: 'Barcelona, España',
    labels: ['Builder', 'Comercio', 'Automatización'],
    avatar: null,
    stats: { followers: 8, following: 6 },
    links: {
      linkedin: 'https://linkedin.com/in/carlosruiz',
      github: 'https://github.com/carlosruiz',
      web: 'https://carlosruiz.dev',
    },
    stack: [
      { category: 'Backend',      items: ['Node.js', 'Python', 'Supabase'] },
      { category: 'Frontend',     items: ['React', 'Vite'] },
      { category: 'Herramientas', items: ['n8n', 'Zapier', 'GitHub Actions'] },
    ],
    projects: [
      {
        id: 'autostock',
        name: 'AutoStock',
        status: 'development',
        tagline: 'Gestión de inventario automatizada para tiendas online.',
        description:
          'Sincroniza stock en tiempo real entre tu tienda, almacén y proveedores. Cero roturas de stock, cero sobrestock.',
        tags: ['Node.js', 'Supabase', 'Comercio', 'Automatización'],
        url: null,
        problem:
          'Las tiendas online medianas gestionan el inventario a mano entre tres o cuatro sistemas distintos. El resultado son roturas de stock que cuestan ventas y sobrestock que congela capital.',
        how:
          'AutoStock conecta tu tienda (Shopify, WooCommerce), tu almacén y tus proveedores en un solo dashboard. Las alertas y reposiciones ocurren automáticamente según las reglas que tú defines.',
        features: [
          { title: 'Sincronización en tiempo real', description: 'Stock actualizado en todos los canales en menos de 30 segundos.' },
          { title: 'Alertas automáticas', description: 'Notificación cuando el stock baja del umbral definido por SKU.' },
          { title: 'Reposición automática', description: 'Genera órdenes de compra al proveedor cuando se activa la alerta.' },
          { title: 'Dashboard unificado', description: 'Vista global de todos los canales en un solo lugar.' },
        ],
        screenshots: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'],
      },
    ],
  },
]

export function getAllProjects() {
  return builders.flatMap((builder) =>
    builder.projects.map((project) => ({ ...project, builder }))
  )
}

export function getBuilderBySlug(slug) {
  return builders.find((b) => b.slug === slug) ?? null
}

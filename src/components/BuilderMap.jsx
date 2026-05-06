import { useMemo } from 'react'

// Equirectangular projection: x = lon+180, y = 90-lat — viewBox "0 0 360 180"
const CITIES = {
  'madrid':        { x: 176.3, y: 49.6 },
  'barcelona':     { x: 182.2, y: 48.6 },
  'valencia':      { x: 179.6, y: 50.5 },
  'sevilla':       { x: 174.0, y: 52.6 },
  'seville':       { x: 174.0, y: 52.6 },
  'bilbao':        { x: 177.1, y: 46.7 },
  'zaragoza':      { x: 179.1, y: 48.3 },
  'málaga':        { x: 175.4, y: 53.3 },
  'malaga':        { x: 175.4, y: 53.3 },
  'alicante':      { x: 179.2, y: 51.9 },
  'murcia':        { x: 178.5, y: 52.4 },
  // 'las palmas' debe ir antes que 'palma' para que "Las Palmas de Gran Canaria" no caiga en Mallorca
  'las palmas':    { x: 164.6, y: 61.9 },
  'palma':         { x: 182.4, y: 51.7 },
  'valladolid':    { x: 176.5, y: 48.7 },
  // 'córdoba españa' / 'córdoba, españa' antes del genérico — evita match con Córdoba, Argentina
  'córdoba, españa':  { x: 175.7, y: 52.2 },
  'cordoba, españa':  { x: 175.7, y: 52.2 },
  'córdoba, spain':   { x: 175.7, y: 52.2 },
  'córdoba':       { x: 175.7, y: 52.2 },
  'cordoba':       { x: 175.7, y: 52.2 },
  'granada':       { x: 176.5, y: 52.9 },
  'vigo':          { x: 171.5, y: 47.7 },
  'coruña':        { x: 171.3, y: 46.6 },
  'oviedo':        { x: 174.3, y: 46.3 },
  // 'santander, colombia' se excluye vía NON_SPAIN antes del match
  'santander':     { x: 176.0, y: 46.2 },
  'pamplona':      { x: 178.2, y: 47.0 },
  'san sebastián': { x: 178.9, y: 46.5 },
  'donostia':      { x: 178.9, y: 46.5 },
}

// Si la localización menciona explícitamente otro país, no matcheamos ciudades españolas
const NON_SPAIN = [
  'argentina', 'colombia', 'méxico', 'mexico', 'chile', 'perú', 'peru',
  'venezuela', 'ecuador', 'bolivia', 'paraguay', 'uruguay', 'cuba', 'brasil',
  'brazil', 'nicaragua', 'costa rica', 'panamá', 'panama', 'guatemala',
  'usa', 'eeuu', 'united states', 'estados unidos', 'france', 'italia',
  'italy', 'germany', 'alemania', 'uk', 'united kingdom', 'reino unido',
]

function matchCity(location) {
  if (!location) return null
  const lower = location.toLowerCase()
  if (NON_SPAIN.some(c => lower.includes(c))) return null
  for (const [key, pos] of Object.entries(CITIES)) {
    if (lower.includes(key)) return pos
  }
  return null
}

const LAND = [
  'M 15,25 L 23,19 L 80,10 L 95,25 L 125,40 L 127,43 L 119,45 L 106,50 L 100,65 L 90,60 L 83,64 L 83,70 L 85,75 L 90,75 L 96,81 L 101,81 L 84,76 L 76,71 L 70,67 L 56,55 L 50,35 L 30,29 Z',
  'M 130,14 L 162,14 L 160,30 L 129,30 Z',
  'M 91,65 L 105,66 L 101,70 L 88,69 Z',
  'M 101,81 L 103,86 L 100,90 L 103,102 L 109,123 L 113,145 L 112,140 L 122,125 L 127,124 L 140,113 L 145,95 L 145,85 L 117,80 L 107,78 L 103,82 Z',
  'M 171,48 L 172,53 L 174,54 L 182,49 L 185,47 L 187,46 L 195,52 L 200,51 L 207,52 L 209,49 L 214,43 L 204,34 L 208,19 L 198,25 L 189,35 L 185,37 L 182,40 L 180,39 L 175,32 L 170,36 L 175,42 Z',
  'M 173,36 L 180,36 L 180,42 L 175,44 L 172,42 Z',
  'M 166,55 L 183,53 L 215,59 L 223,79 L 231,79 L 220,100 L 215,112 L 198,124 L 192,96 L 183,86 L 163,76 Z',
  'M 209,49 L 216,49 L 228,45 L 232,53 L 235,65 L 238,78 L 248,66 L 257,82 L 261,82 L 260,76 L 270,70 L 278,70 L 283,85 L 287,70 L 301,60 L 311,59 L 321,45 L 322,40 L 340,30 L 360,25 L 360,17 L 330,17 L 280,17 L 240,20 L 240,36 L 228,45 Z',
  'M 232,53 L 248,66 L 257,82 L 252,86 L 238,78 L 235,65 Z',
  'M 318,52 L 324,52 L 322,60 L 316,60 Z',
  'M 294,112 L 295,122 L 318,125 L 324,127 L 327,132 L 331,118 L 325,105 L 311,102 Z',
]

export default function BuilderMap({ builders }) {
  const dots = useMemo(() => {
    const seen = {}
    builders.forEach(b => {
      const pos = matchCity(b.location)
      if (!pos) return
      const key = `${pos.x},${pos.y}`
      if (!seen[key]) seen[key] = { ...pos, names: [] }
      seen[key].names.push(b.name)
    })
    return Object.values(seen)
  }, [builders])

  if (dots.length === 0) return null

  return (
    <div className="map-section">
      <div className="map-header">
        <p className="map-label">Comunidad</p>
        <h3 className="map-title">Builders en el mapa</h3>
        <p className="map-sub">
          {builders.length} {builders.length === 1 ? 'builder' : 'builders'} —{' '}
          {dots.length} {dots.length === 1 ? 'ciudad' : 'ciudades'}
        </p>
      </div>

      <div className="map-wrapper">
        <svg
          viewBox="0 0 360 180"
          className="map-svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <filter id="builders-map-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="360" height="180" fill="#0a0f1c" />

          <g fill="#1a2540" stroke="#243354" strokeWidth="0.4" strokeLinejoin="round">
            {LAND.map((d, i) => <path key={i} d={d} />)}
          </g>

          {dots.map((dot, i) => (
            <g key={i}>
              <circle
                cx={dot.x}
                cy={dot.y}
                r={4}
                fill="rgba(124,58,237,0.25)"
                className="map-dot-ring"
              />
              <circle
                cx={dot.x}
                cy={dot.y}
                r={1.6}
                fill="#7c3aed"
                filter="url(#dot-glow)"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

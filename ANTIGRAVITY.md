# ANTIGRAVITY.md — Contexto de sesión para Builders

> Pega este archivo completo al inicio de cada sesión antes de cualquier tarea.
> Lee todo antes de escribir una sola línea de código.
> Luego lee `SESSIONS.md` — ahí está exactamente lo que tienes que hacer en esta sesión.

---

## Tu rol en este proyecto

Trabajas en un flujo "doble agente":
- **Tú (Antigravity):** construcción, scaffolding, tareas mecánicas y voluminosas
- **Claude Code (VS Code):** auditoría, refinamiento y correcciones de calidad

Al terminar tu sesión:
1. Escribir `HANDOFF.md` (Claude Code lo lee automáticamente al inicio de su sesión)
2. Actualizar `SESSIONS.md`: mover tu sesión a Completadas, promover la siguiente a CURRENT
3. Sin estos dos pasos el flujo se rompe — son obligatorios.

---

## Qué es Builders

Plataforma de descubrimiento de proyectos para builders hispanohablantes que construyen con IA.

- **Entidad principal:** proyectos (no builders) — el feed muestra proyectos, los builders son el contexto
- **Diferenciador clave:** `status` funcional — En vivo / Demo / En desarrollo
- **Idioma del producto:** español en toda la UI
- Stack: React + Vite + Supabase + Vanilla CSS — sin TypeScript, sin Tailwind, sin UI frameworks

---

## Estado actual — Fase 4

### Completado
- Nav + Footer + sistema de rutas (React Router v6)
- Home: feed dual (proyectos + builders), búsqueda en tiempo real, filtros por sector/stack, toggle
- Perfil público `/builder/:slug`: hero con proyecto destacado, métricas, links sociales, modal de proyecto
- Dashboard: ProfileForm + ProjectForm (UI completa conectada a Supabase)
- Onboarding `/setup`: 4 pasos (identidad → sectores → links → primer proyecto)
- Auth: Supabase Auth real via `AuthContext` + rutas protegidas con `ProtectedRoute`
- Supabase Storage: buckets `avatars` y `screenshots` (ambos públicos)
- Anti-XSS: `formatUrl()` en todos los inputs de URL
- BuilderMap SVG con dots pulsantes por ciudad

### Prioridades activas (en orden)
1. Migración de schema Supabase — añadir columnas `problem`, `how`, `features`, `tags` a `projects`
2. RLS en Supabase — builders y projects solo editables por su owner
3. og:image real (1200×630px) en `index.html`
4. Conectar Vercel + env vars en Vercel dashboard

---

## Arquitectura de rutas

```
/              → Home (feed + búsqueda + toggle proyectos/builders)
/builder/:slug → Perfil público del builder
/registro      → Alta → redirige a /setup tras confirmar email
/login         → Login → redirige a /dashboard
/setup         → Onboarding 4 pasos (ruta protegida)
/dashboard     → Editor de perfil y proyectos (ruta protegida)
```

Nav y Footer se ocultan en `/login`, `/registro`, `/setup` y `/dashboard`.

---

## Estructura de archivos

```
src/
  pages/
    Home.jsx
    BuilderProfile.jsx
    Dashboard.jsx
    Login.jsx
    Registro.jsx
    Setup.jsx
  components/
    Nav.jsx
    Footer.jsx
    FeedCard.jsx
    BuilderCard.jsx
    BuilderAvatar.jsx
    BuilderMap.jsx
    FilterBar.jsx
    SearchBar.jsx
    ProjectModal.jsx
    ProfileProjectCard.jsx
    ProfileForm.jsx
    ProjectForm.jsx
    ParticleBackground.jsx
  context/
    AuthContext.jsx          ← useAuth(), AuthProvider, ProtectedRoute
  lib/
    supabase.js              ← cliente + uploadAvatar() + uploadScreenshot()
    utils.js                 ← formatUrl() — anti-XSS
  data/
    builders.js              ← datos mock mientras no hay usuarios reales
  styles/
    main.css                 ← SOLO @imports — nunca escribir estilos aquí
    base.css                 ← variables CSS + reset + keyframes
    layout.css               ← nav + botones + secciones + footer
    home.css                 ← hero + feed + search + toggle
    modal.css                ← modal de proyecto
    profile.css              ← perfil público del builder
    auth.css                 ← login + registro + setup
    dashboard.css            ← dashboard de edición
    components.css           ← cards, pills, avatares, mapa, badges
    responsive.css           ← media queries — siempre el último @import
```

---

## Schema Supabase — completo y exacto

### Tabla `builders`
| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid | PK — igual que `auth.users.id` |
| slug | text | único, generado desde el nombre |
| name | text | |
| bio | text | max 160 chars |
| location | text \| null | ciudad libre, ej: "Madrid, España" |
| avatar_url | text \| null | URL pública de Supabase Storage |
| sectors | text[] | ej: ['Finanzas', 'Salud'] |
| labels | text[] | ej: ['Fundador', 'Desarrollador'] |
| links | jsonb | `{ linkedin, github, web }` — solo los que tienen valor |
| published | boolean | false por defecto |

### Tabla `projects`
| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid | PK auto |
| builder_id | uuid | FK → builders.id |
| title | text | |
| description | text \| null | tagline, max 120 chars |
| status | text | `'live'` \| `'demo'` \| `'development'` |
| url | text \| null | URL pública del proyecto |
| screenshot_url | text \| null | primera imagen (URL pública Storage) |
| featured | boolean | default false — solo 1 por builder |
| order_index | integer | default 0 — orden manual en el perfil |

**Columnas pendientes de migración (deuda ALTO):**
```sql
ALTER TABLE projects
  ADD COLUMN problem     text,
  ADD COLUMN how         text,
  ADD COLUMN features    jsonb,
  ADD COLUMN tags        text[];
```

### Storage buckets
- `avatars` — público. Path: `{userId}/avatar.{ext}`
- `screenshots` — público. Path: `{userId}/{timestamp}-{random}.{ext}`
- Extensiones permitidas: jpg, jpeg, png, webp

---

## Sistema de autenticación

**No usar localStorage para auth** — el proyecto migró a Supabase Auth real.

```js
// Importar siempre así
import { useAuth } from '../context/AuthContext'

// Hook disponible en cualquier componente dentro de AuthProvider
const { user, loading, signUp, signIn, signOut } = useAuth()

// user.id === builders.id en Supabase
// user.user_metadata.name → nombre del usuario
```

Rutas protegidas usan `<ProtectedRoute>` en `App.jsx` — redirige a `/login` si no hay sesión.

---

## Diseño y estética

**Filosofía:** premium minimal, limpio, Apple-style. Sin decoración innecesaria.

### Variables CSS (definidas en `base.css`)
```css
--bg-main: #f8fafc
--bg-card: rgba(255,255,255,0.7)       /* glassmorphism */
--bg-card-hover: rgba(255,255,255,0.95)
--bg-overlay: rgba(248,250,252,0.8)
--border-color: rgba(0,0,0,0.08)
--border-hover: rgba(0,0,0,0.15)
--text-primary: #0f172a
--text-secondary: #475569
--text-muted: #94a3b8
--accent-color: #7c3aed               /* violeta — color de marca */
--accent-glow: rgba(124,58,237,0.2)
--font-main: 'Inter', system-ui, -apple-system, sans-serif
--max-width: 1200px
--nav-height: 72px
--transition-fast: 0.15s ease
--transition-normal: 0.3s cubic-bezier(0.4,0,0.2,1)
--transition-bounce: 0.4s cubic-bezier(0.34,1.56,0.64,1)
```

Clase utilitaria `.glass` → glassmorphism (bg-card + backdrop-filter blur 12px + border).

### Formularios (Apple-style)
- Inputs: border sutil, focus con `box-shadow` violeta, sin outline
- Labels sobre el input, nunca placeholder como único indicador
- Botones: `btn-primary` (violeta sólido) y `btn-secondary` (borde, fondo transparente)
- Separación generosa entre grupos — respiración visual
- Errores inline bajo el campo, nunca en modal

### Componentes
- Cards con glassmorphism + `border-radius: 16px`
- Status badges como dot SVG de color inline (sin emojis)
  - live → verde `#22c55e`
  - demo → azul `#3b82f6`
  - development → naranja `#f59e0b`
- Transiciones en hover siempre con `var(--transition-normal)`

---

## Reglas de código — obligatorias

1. **Una responsabilidad por archivo** — no mezclar lógica con UI
2. **CSS solo en `src/styles/`** — identifica el archivo de dominio antes de escribir
3. **`main.css` es solo entry point** — nunca añadir estilos ahí directamente
4. **Sin Tailwind** — Vanilla CSS con las variables de `base.css`
5. **Sin dependencias npm nuevas** sin aprobación explícita
6. **Sin emojis** — estados visuales con SVG dot de color inline
7. **Links externos** siempre con `target="_blank" rel="noopener noreferrer"`
8. **Variables de entorno** en `.env.local` — nunca en código fuente
9. **Datos** en `src/data/` o Supabase — nunca hardcodeados en JSX
10. **Sin comentarios** que expliquen QUÉ — solo el POR QUÉ si no es obvio
11. **URLs de usuario** siempre pasan por `formatUrl()` de `src/lib/utils.js`
12. **Llamadas a Supabase** siempre envueltas en `try/catch`
13. **Idioma de la UI:** español — textos, labels, placeholders y mensajes de error

---

## Patrones de importación

```js
// Cliente Supabase y helpers de Storage
import { supabase, uploadAvatar, uploadScreenshot } from '../lib/supabase'

// Auth
import { useAuth } from '../context/AuthContext'

// Sanitización de URLs
import { formatUrl } from '../lib/utils'

// Navegación
import { useNavigate, Link, useParams } from 'react-router-dom'
```

---

## Deuda técnica activa

| Severidad | Descripción |
|-----------|-------------|
| **ALTO** | `projects` no tiene columnas `problem`, `how`, `features jsonb`, `tags text[]` — ProjectForm las recoge pero no las guarda |
| BAJO | STATUS y GRADIENTS duplicados en FeedCard y ProjectModal — extraer a `src/data/constants.js` |
| BAJO | `matchedBuilders` en Home no respeta el filtro activo de sector |
| BAJO | Builders mock (María, Carlos) aparecen en feed permanentemente |
| BAJO | Footer linkea a `linkedin.com/company/builders-es` — puede no existir |

---

## Módulos congelados

> Ninguno actualmente.

---

## Antes de tareas grandes — plan primero

Si la tarea toca más de 2 archivos, escribe el plan antes de cualquier código:

```
PLAN:
- Archivos a crear: [lista]
- Archivos a modificar: [lista]
- Orden de ejecución: [1, 2, 3...]
- Decisión arquitectónica en cada punto: [por qué, no qué]
```

Espera confirmación de Ivan antes de proceder.

---

## Formato HANDOFF — obligatorio al terminar cada tarea

**No outputs en chat.** Al terminar, sobreescribe el archivo `HANDOFF.md` en la raíz del proyecto con este formato exacto:

```markdown
# HANDOFF

> Archivo de traspaso entre Antigravity (construcción) y Claude Code (auditoría).
> Antigravity sobreescribe este archivo al terminar cada tarea.
> Claude Code lo lee al inicio de sesión y lo vacía tras auditar.

---

**Tarea:** [nombre breve de la tarea completada]
**Fecha:** [YYYY-MM-DD]

## Archivos creados
- ruta/completa/archivo.jsx

## Archivos modificados
- ruta/completa/archivo.css → [qué sección cambió]

## Decisiones tomadas
- [por qué este enfoque, no qué hace el código]

## Supuestos / pendiente
- [qué asumiste o dejaste sin resolver]

## Deuda técnica nueva
- [si introdujiste algo que sería mejor hacer diferente]
```

Claude Code leerá este archivo automáticamente al inicio de la siguiente sesión.

---
name: Estado del proyecto — Builders
description: Plataforma de proyectos builders hispanohablantes — Fase 4 en curso
type: project
---

**Proyecto:** Builders
**Fase actual:** Fase 4 — pre-deploy
**Repo:** https://github.com/ivanlrhvc-cmyk/builders
**Deploy:** Pendiente conectar Vercel (Sesión 6)
**Última sesión:** 2026-05-06 (segunda sesión)

---

## Sesión 2026-05-06 — Sistema doble agente automatizado + S1-S3

### Workflow doble agente formalizado
- `HANDOFF.md` en raíz — Antigravity lo escribe al terminar, Claude Code lo lee automáticamente al inicio y lo vacía
- `SESSIONS.md` en raíz — fuente de verdad del plan de sesiones. Ambos agentes lo leen y actualizan (mueven CURRENT → Completadas, promueven siguiente)
- `CLAUDE.md` actualizado: leer SESSIONS.md al inicio + vaciar HANDOFF si tiene contenido
- `ANTIGRAVITY.md` actualizado: leer SESSIONS.md al inicio, escribir HANDOFF.md + actualizar SESSIONS.md al terminar

### División de trabajo establecida
- **Antigravity:** scaffolding, features nuevas desde cero, SQL scripts, tareas voluminosas y mecánicas
- **Claude Code:** auditoría, bugs en código existente, refactors cross-file, seguridad, conexión de features a código existente
- **Zona gris:** crear feature nueva → Antigravity; conectarla al código existente → Claude Code

### Sesión 1 — Antigravity: SQL generado y auditado
- `supabase/migrations/001_projects_new_columns.sql` — ALTER TABLE projects ADD COLUMN problem, how, features jsonb, tags text[]
- `supabase/migrations/002_rls_policies.sql` — RLS en builders y projects (SELECT público, write solo owner)
- Auditado: SQL correcto. Políticas FOR SELECT (true) + FOR ALL (auth.uid()) → OR permissivo en Supabase

### Sesión 2 — Ivan: SQL ejecutado en Supabase dashboard

### Sesiones S1–S5 completadas

**S1 — Antigravity:** SQL generado y auditado (`001_projects_new_columns.sql`, `002_rls_policies.sql`)
**S2 — Ivan:** SQL ejecutado en Supabase dashboard
**S3 — Claude Code:** constants.js, ProjectForm+Modal importan desde constants, BuilderProfile guarda problem/how/features/tags, Home fix filtro builders
**S4 — Antigravity:** `api/og.jsx` — Edge function Vercel con `@vercel/og`. Imagen 1200×630px, fallback genérico, doble fallback env vars
**S5 — Claude Code (auditoría S4):** aprobada. Nota: `boxShadow` ignorado silenciosamente por Satori (BAJO, no bloqueante)

---

## Estado actual de SESSIONS.md

**CURRENT:** Sesión 6 — Ivan: conectar Vercel
1. Conectar repo en vercel.com → New Project
2. Añadir env vars: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Deploy y verificar rutas SPA (vercel.json ya tiene rewrites)
4. Probar `api/og.jsx` en producción tras deploy

**S4 y S5 completadas en esta sesión.**

---

## Qué está construido (estado actual)

### Stack
React + Vite + Supabase Auth real + Vanilla CSS. Sin TypeScript, sin Tailwind.

### Rutas
```
/              → Home (feed proyectos + builders, búsqueda, filtros, toggle)
/builder/:slug → Perfil público (hero destacado, métricas, links, proyectos, modal)
/registro      → Alta → email confirmation → /setup
/login         → Login → /builder/:slug
/setup         → Onboarding 4 pasos (protegida)
/dashboard     → Redirect a /builder/:slug o /setup
```
Nav y Footer ocultos en /login, /registro, /setup.

### Componentes clave
- `AuthContext.jsx` — useAuth(), AuthProvider, ProtectedRoute
- `lib/supabase.js` — cliente + uploadAvatar() + uploadScreenshot()
- `lib/utils.js` — formatUrl() anti-XSS
- `data/builders.js` — mock builders (María, Carlos + Iván)
- `data/constants.js` — STATUSES, STATUS_LABEL, STATUS_COLOR

### Schema Supabase (actual)
**builders:** id, slug, name, bio, location, avatar_url, sectors[], labels[], links jsonb, published
**projects:** id, builder_id, title, description, status, url, screenshot_url, featured, order_index, problem, how, features jsonb, tags[]
**Storage:** buckets `avatars` y `screenshots` (ambos públicos)

---

## Deuda técnica activa

| Severidad | Descripción |
|-----------|-------------|
| BAJO | Builders mock (María, Carlos) aparecen en feed — retirar cuando haya builders reales |
| BAJO | Footer linkea a linkedin.com/company/builders-es — verificar si existe (se revisa en S5) |
| BAJO | BuilderMap solo tiene ciudades españolas — expandir cuando haya builders latinoamericanos |

---

## Decisiones de producto (firmes)
- Entidad principal: proyectos (no builders)
- Discovery-first: home ES la exploración
- Builders hispanohablantes que construyen con IA
- Diferenciador: status funcional (En vivo / Demo / En desarrollo)
- No follow/seguidores hasta que exista feed de actualizaciones
- No estado de disponibilidad — demasiado señal de red social

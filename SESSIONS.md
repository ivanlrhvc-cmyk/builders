# SESSIONS — Builders

> Leído por Antigravity y Claude Code al inicio de cada sesión.
> El agente que termina su sesión mueve CURRENT a Completadas y promueve la siguiente.
> Las sesiones de Ivan son pasos manuales — no requieren agente.

---

## CURRENT → Sesión 5 — Claude Code: Auditoría S4 + cierre

**Agente:** Claude Code
**Tipo:** Auditoría

Auditar HANDOFF de Sesión 4. Verificar:
- Función OG retorna imagen válida y no expone credenciales
- Meta tag bien formada en BuilderProfile
- Footer: corregir link `linkedin.com/company/builders-es` si no existe (preguntar a Ivan)
- Revisión general pre-deploy

**Al terminar:** Actualizar SESSIONS.md — mover S5 a Completadas, promover S6.

---

## Backlog

### Sesión 6 — Ivan: Conectar Vercel
**Agente:** Ninguno (paso manual de Ivan)
**Pasos:**
1. Conectar repo en vercel.com → New Project
2. Añadir env vars: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Deploy y verificar rutas SPA (ya hay `vercel.json`)
4. Añadir og:image estático en `index.html` si S4 no está listo aún

---

## Completadas

### Sesión 4 — Antigravity: OG image
**Agente:** Antigravity
**Tipo:** Feature nueva
**Estado:** Completada
**Archivos generados:** `api/og.jsx` (Serverless Edge Function) y `@vercel/og` añadido a dependencies.

### Sesión 3 — Claude Code: Conectar campos + fixes
- `src/data/constants.js` creado — STATUSES, STATUS_LABEL, STATUS_COLOR
- `ProjectForm.jsx` y `ProjectModal.jsx` importan desde constants
- `BuilderProfile.jsx` — `normalizeProject` mapea `problem`, `how`, `features`, `tags` desde Supabase; `handleSaveProject` los guarda
- `Home.jsx` — `normalizeSupabaseBuilder` incluye `sectors` para que el filtro funcione

### Sesión 2 — Ivan: Ejecutar SQL
**Agente:** Ninguno
**Estado:** Completada
**Pasos:** Columnas nuevas y políticas RLS creadas exitosamente en la DB.

### Sesión 1 — Antigravity: Generación SQL
**Agente:** Antigravity
**Tipo:** Generación SQL
**Estado:** Completada
**Archivos generados:** `001_projects_new_columns.sql` y `002_rls_policies.sql`

# Project Kickoff — Checklist de inicio

> Seguir este orden exacto al arrancar un proyecto nuevo. Se hace una vez, igual siempre.

---

## Paso 1 — Identidad (antes de crear nada)

- [ ] Nombre del proyecto definido
- [ ] Dominio disponible y reservado
- [ ] Problema que resuelve definido en una frase
- [ ] Usuario objetivo definido
- [ ] Audiencia principal clara (¿a quién le habla?)

## Paso 2 — Repositorio

- [ ] Crear repo en GitHub: `github.com/new`
- [ ] Copiar esta plantilla al nuevo proyecto
- [ ] Rellenar `CONTEXT.md` con la identidad del producto
- [ ] Rellenar `CLAUDE.md` con stack y reglas específicas del proyecto
- [ ] Actualizar `.env.example` con las variables que necesitará el proyecto
- [ ] Crear `.env.local` con los valores reales (no se commitea)
- [ ] Primer commit: `chore: init project from builder-template`

## Paso 3 — Infraestructura

- [ ] Conectar repo a Vercel (`vercel.com/new`)
- [ ] Vercel detecta Vite automáticamente — verificar build command: `npm run build`
- [ ] Configurar variables de entorno en Vercel
- [ ] Configurar dominio personalizado en Vercel
- [ ] Verificar deploy automático funcionando (push a main → deploy)

## Paso 4 — Monitorización (si el proyecto va a producción)

- [ ] Crear proyecto en Sentry (`sentry.io`)
- [ ] Instalar SDK: `npm install @sentry/react`
- [ ] Configurar en `main.jsx` con DSN de Sentry
- [ ] Verificar que Sentry recibe el primer evento de prueba

## Paso 5 — Gestión

- [ ] Crear las primeras GitHub Issues para Fase 1
- [ ] Configurar GitHub Project (tablero kanban) si el proyecto es largo
- [ ] Crear primera entrada en `CHANGELOG.md`
- [ ] Crear memoria inicial del proyecto en `memory/project_[nombre].md`

## Paso 6 — Verificación

- [ ] El repo tiene `CLAUDE.md`, `CONTEXT.md`, `BUILDER_MANUAL.md`
- [ ] `.env.local` está en `.gitignore`
- [ ] Deploy de Vercel funciona en la URL del proyecto
- [ ] Primera sesión de Claude Code arranca leyendo `CLAUDE.md` + `MEMORY.md`

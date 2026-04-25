# CONTEXT.md — Builders

*Última actualización: 2026-04-25*

---

## Identidad del producto

| Concepto | Valor |
|----------|-------|
| Nombre | Builders |
| Tagline | "Lo que construyes vale más que tu currículum" |
| Misión | Dar a builders de tecnología un lugar donde mostrar lo que construyen |
| Usuario objetivo | Builders hispanohablantes que crean herramientas reales con IA |
| Problema que resuelve | No hay un lugar específico donde mostrar proyectos técnicos reales con demos funcionales |
| Tono | Directo, claro, sin adornos. Los proyectos hablan por sí solos |
| Idioma | Español |

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite (JSX) |
| Estilos | CSS puro con variables — `src/styles/main.css` |
| Hosting | Vercel |
| Contacto | Formspree |
| Fuentes | DM Serif Display + DM Sans (Google Fonts) |
| BD | — (Fase 2: Supabase) |
| Auth | — (Fase 2: Supabase Auth) |
| IA | — (Fase 2: demos interactivas con Claude API) |

---

## Estructura de archivos

```
src/
  components/
    Nav.jsx
    Hero.jsx
    Projects.jsx
    ProjectCard.jsx
    Stack.jsx
    Contact.jsx
    Footer.jsx
  styles/
    main.css          — variables, reset, tipografía, componentes
  data/
    projects.js       — datos de proyectos (nunca hardcodeados en JSX)
  __tests__/          — tests (Fase 2 cuando haya lógica)
App.jsx
main.jsx
```

---

## Roadmap

```
FASE 1  ✅  Portfolio personal: perfil Iván + Vontury + contacto
FASE 2  [ ]  Plataforma: registro builders, perfiles, exploración, filtros
FASE 3  [ ]  Crecimiento: búsqueda IA por problema, demos interactivas, expansión
```

---

## Audiencias

**Audiencia A — Clientes potenciales:** quieren ver qué problemas resuelves y si puedes resolver el suyo. Les importa el resultado, no el código.

**Audiencia B — Empresas / reclutadores técnicos:** quieren ver capacidad técnica real, stack, complejidad de proyectos.

**Mensaje por audiencia:**
- A: "Esto es lo que construyo y el problema que resuelve"
- B: "Esto es cómo lo construyo y con qué"

---

## Decisiones de producto — no cambiar sin justificación

| Decisión | Motivo |
|----------|--------|
| Sin tarjeta "Próximamente" vacía | Una tarjeta vacía transmite que no hay más proyectos |
| Sin React Router en Fase 1 | Una sola página no necesita routing — se añade en Fase 2 |
| Sin modal de demo en Fase 1 | Ningún proyecto tiene estado "Demo interactiva" aún |
| Datos de proyectos en `data/projects.js` | Preparado para venir de BD en Fase 2 sin cambiar componentes |
| Hover expand → solo click | Hover no existe en móvil |
| Sin emojis en estados | SVG dots de color — más limpio y consistente |

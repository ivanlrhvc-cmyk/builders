---
name: Ideas pendientes de discutir
description: Ideas anotadas por Iván para revisar en futuras sesiones — no implementar sin confirmar
type: project
---

## Roadmap acordado (2026-04-30)

**Completado:**
- Toggle Proyectos/Builders en Home — BuilderCard con grid, búsqueda y filtros funcionan en ambas vistas
- Proyecto destacado — hero full-width + grid 2 columnas + ordenación manual con flechas + hover controls

**Pendiente — siguiente sesión:**
1. OG image dinámica — Vercel serverless function en `/api/og?slug=ivan` con `@vercel/og`. Fetch datos de Supabase, imagen con avatar + nombre + bio + proyecto count. Después: añadir `<meta og:image>` en BuilderProfile.
2. Mejoras al Home — pendiente definir qué exactamente mejorar (Ivan lo mencionó como prioritario pero no se implementó esta sesión)

**Decisiones de producto (2026-04-30):**
- Builders = portfolio que demuestra que sabes construir cosas (prueba de trabajo, no red social)
- No "Seguir" por ahora — requiere feed de actualizaciones inexistente
- No estado de disponibilidad en perfil — demasiado señal de red social
- Perfil = la mejor página que existe sobre esa persona. Mejor que su LinkedIn.

**Futuro (no implementar aún):**
- Analytics de perfil — contador de vistas por perfil + stats semanales. Tabla `profile_views` con timestamps. Gancho de retención clave, pero no es el momento.
- SEO meta tags — va junto con OG image, después del punto 3
- Onboarding mejorado — guiar al builder para que el perfil quede completo antes de salir
- Newsletter semanal — Resend + emails recogidos en Supabase. No es core aún.
- SSR / Next.js — solo si el SEO se vuelve crítico. Cambio arquitectural grande.
- Follow/seguidores real — cuando exista un feed de actualizaciones de proyectos

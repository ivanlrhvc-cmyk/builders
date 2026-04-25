# CLAUDE.md — Builders

> Léelo siempre al inicio de sesión junto con memory/MEMORY.md. Nada más.

---

## Instrucciones operativas

**Inicio de sesión:**
1. Leer este archivo + `memory/MEMORY.md` — nada más hasta que la tarea lo requiera
2. No leer código salvo que sea estrictamente necesario para la tarea
3. Confirmar con el usuario el objetivo de la sesión antes de actuar

**Durante la sesión:**
- Agrupar lecturas independientes en paralelo (un solo mensaje, múltiples tool calls)
- Completar un archivo entero antes de pasar al siguiente
- No releer archivos ya leídos en la misma sesión salvo cambio
- Tareas de análisis: responder directo sin leer código innecesario

**Cierre de sesión obligatorio:**
- Guardar memoria con estado actualizado del proyecto
- Si se modificaron >3 archivos: auditoría antes de cerrar
- Actualizar deuda técnica si apareció algo nuevo
- Verificar build limpio

---

## Módulos congelados

> Ninguno en Fase 1.

---

## Reglas de código

1. Una responsabilidad por archivo — no mezclar lógica con UI
2. CSS en `src/styles/main.css` — único archivo con variables, sin Tailwind
3. Sin dependencias externas salvo React y Formspree
4. Links externos siempre con `target="_blank" rel="noopener noreferrer"`
5. Variables de entorno en `.env.local` — nunca en código
6. Datos de proyectos en `src/data/projects.js` — nunca hardcodeados en JSX
7. Sin emojis — estados con SVG dot de color inline
8. Sin comentarios que expliquen QUÉ — solo el POR QUÉ si no es obvio

---

## Deuda técnica

| # | Severidad | Descripción | Cuándo |
|---|-----------|-------------|--------|
| 1 | BAJO | Sin React Router — añadir en Fase 2 para /explorar y /builder/[slug] | Fase 2 |
| 2 | BAJO | og:image real pendiente — añadir antes del primer deploy público | Pre-deploy |
| 3 | BAJO | Modal demo interactiva no construido — sin proyecto con ese estado en Fase 1 | Fase 2 |

---

## Bugs resueltos — no repetir

> Vacío en inicio de proyecto.

---

## Auditoría

Ejecutar cuando:
- Se modifican >3 archivos en una sesión
- Antes de cada deploy a producción
- Al integrar una API externa nueva

Severidades CRÍTICO y ALTO se resuelven en la misma sesión.
MEDIO y BAJO van a deuda técnica.

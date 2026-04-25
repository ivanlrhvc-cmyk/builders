# BUILDER MANUAL — Guía de construcción de proyectos

> Aprendido construyendo Vontury. Aplicado en todos los proyectos siguientes.
> Eficiencia no significa hacer menos — significa no desperdiciar.

---

## 1. Antes de tocar código

**Regla principal: planificar antes de accionar.**

- Define el problema con precisión antes de pensar en la solución
- Haz un inventario exhaustivo de todos los cambios necesarios — no empieces hasta tenerlo completo
- Si tocas arquitectura o tomas una decisión no obvia: escribe un ADR en `docs/decisions/` antes de implementar
- Si es UI: describe cómo debe verse y recibe aprobación antes de escribir código
- Lee `CLAUDE.md` + `MEMORY.md` al inicio de cada sesión — nada más

**Señal de que estás listo para implementar:**
Puedes explicar en dos frases qué vas a cambiar, por qué, y qué no vas a tocar.

---

## 2. Durante la sesión

- Agrupa lecturas de archivos independientes en paralelo — un solo mensaje, varias llamadas simultáneas
- Completa un archivo entero antes de pasar al siguiente — no vayas y vuelvas
- No releas archivos ya leídos en la misma sesión salvo que hayan cambiado
- Para tareas de análisis o planificación: responde directo sin leer código innecesario
- Usa TodoWrite para sesiones con más de 3 tareas independientes
- Un objetivo claro por sesión siempre que sea posible

---

## 3. Cierre de sesión obligatorio

Antes de terminar cualquier sesión de trabajo:

- [ ] Guardar memoria con el estado actualizado del proyecto
- [ ] Si se modificaron >3 archivos: ejecutar auditoría técnica
- [ ] Actualizar deuda técnica en `CLAUDE.md` si apareció algo nuevo
- [ ] Verificar que el build está limpio y sin errores de consola
- [ ] Ejecutar tests si se tocó lógica crítica

---

## 4. Eficiencia de tokens IA

**Lo que consume sin valor:**
- Releer archivos que no han cambiado
- Explicar lo que el código ya dice
- Vueltas de confirmación innecesarias
- Construir archivo por archivo pudiendo hacerlo en paralelo

**Lo que no se sacrifica por ahorrar:**
- Auditorías completas cuando toca
- Leer lo necesario para no cometer errores
- Calidad del output

**Protocolo:**
- Inicio de sesión: solo `CLAUDE.md` + `MEMORY.md`
- Sin resúmenes de lo que se acaba de hacer — el código habla solo
- Usar los prompts estándar de `docs/session-prompts.md`
- La memoria es la fuente de verdad — no releer el codebase para contextualizar

---

## 5. Calidad de código

- Una responsabilidad por archivo — no mezclar lógica con UI
- Lógica crítica aislada en funciones puras (sin React, sin hooks)
- Tests desde el día 1 para toda lógica que calcule datos sensibles
- Sin dependencias externas innecesarias — cada dependencia es deuda futura
- Seguridad básica no es opcional:
  - Keys en `.env.local`, nunca en código
  - `target="_blank"` siempre con `rel="noopener noreferrer"`
  - Validación en todos los boundaries externos (formularios, APIs)
  - Sin datos inventados o hardcodeados que no vengan del motor
- Naming consistente: componentes en PascalCase, funciones en camelCase, archivos en kebab-case

---

## 6. Gestión de ideas

- Ideas en **GitHub Issues** con etiqueta `idea` — nunca en la cabeza ni en notas sueltas
- Si la idea viene de Claude.ai u otra fuente externa: copiarla a `docs/ideas.md` antes de que se pierda
- No implementar una idea el mismo día que aparece — planificar primero, implementar después
- Revisar `docs/ideas.md` al inicio de cada sesión nueva

---

## 7. Pre-deploy

Antes de cada deploy a producción, revisar `docs/deploy-checklist.md` completo.

Nunca deployar con:
- Errores en consola del navegador
- Tests fallando
- Keys o secrets expuestos en código
- Sin haber verificado responsive en móvil

---

## 8. Auditoría técnica

**Cuándo es obligatoria:**
- Al finalizar una sesión con >3 archivos modificados
- Antes de cada deploy a producción
- Al integrar una API externa nueva
- Al tocar autenticación, pagos o datos de usuario

**Qué cubre:**
- Seguridad: keys expuestas, CORS, inyección, XSS, IDOR, headers
- Lógica: cálculos críticos, edge cases sin cubrir, arrays sin guard
- Rendimiento: renders innecesarios, llamadas duplicadas a API
- UX: errores silenciosos, estados de carga sin manejar, comportamiento en móvil
- Deuda técnica: qué ha aparecido nuevo que hay que registrar

**Formato de hallazgos:**

| Severidad | Descripción | Solución |
|-----------|-------------|----------|
| CRÍTICO | — | — |
| ALTO | — | — |
| MEDIO | — | — |
| BAJO | — | — |

**Regla:** reportar sin arreglar no aporta valor.
- CRÍTICO y ALTO: se resuelven en la misma sesión
- MEDIO y BAJO: van a deuda técnica en `CLAUDE.md`
- La auditoría termina con build limpio verificado

---

## 9. Estrategia Git

- `main` solo recibe código listo para producción
- Todo desarrollo en ramas: `feature/nombre`, `fix/nombre`, `refactor/nombre`
- Commits con prefijo: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Merge a main solo cuando el código pasa la Definition of Done

**Convención de commits:**
```
feat: añadir sección de proyectos con filtros
fix: corregir scroll en móvil en el nav
refactor: extraer lógica de contacto a hook propio
docs: actualizar CONTEXT.md con fase 2
chore: actualizar dependencias
```

---

## 10. Definition of Done

Una tarea está terminada cuando:

- [ ] El código funciona sin errores de consola
- [ ] Responsive verificado en móvil (375px mínimo)
- [ ] Tests pasan si hay lógica crítica involucrada
- [ ] Sin keys ni secrets expuestos
- [ ] Memoria de sesión guardada
- [ ] Deuda técnica en `CLAUDE.md` actualizada si aplica
- [ ] Rama mergeada a main si la tarea era una feature completa

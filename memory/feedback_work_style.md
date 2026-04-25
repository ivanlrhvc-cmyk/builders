---
name: Estilo de trabajo — feedback acumulado
description: Reglas y preferencias sobre cómo trabajar en los proyectos de Iván
type: feedback
---

## Inventario exhaustivo antes de implementar

No dar por completado el inventario en la primera pasada.

**Why:** Iván verifica que nada quede fuera antes de empezar. Rechaza inventarios incompletos.
**How to apply:** Antes de confirmar "esto es todo", releer el documento de referencia explícitamente. Solo entonces presentar el inventario.

---

## Auditar después de implementar, no solo reportar

La auditoría termina con los fixes aplicados y build limpio. Reportar sin arreglar no aporta valor.

**Why:** El código que queda en el repo debe ser robusto, sin bugs silenciosos.
**How to apply:** En sesiones >3 archivos, ejecutar auditoría y aplicar todos los fixes CRÍTICO, ALTO y MEDIO antes de cerrar.

---

## Eficiencia de sesión

Iván usa Claude Pro con límite de mensajes. Cada lectura innecesaria consume capacidad.

**Why:** Maximizar el trabajo real por sesión.
**How to apply:**
- Inicio: leer solo CLAUDE.md + MEMORY.md
- No releer archivos ya leídos en la sesión
- Batching: agrupar lecturas independientes en paralelo
- Análisis/planificación: responder directo sin leer código innecesario
- Completar un archivo entero antes de pasar al siguiente

---

## Sin resúmenes al final de cada respuesta

No narrar lo que se acaba de hacer.

**Why:** El usuario puede leer el diff. Los resúmenes consumen tokens sin valor.
**How to apply:** Terminar con el resultado, no con una descripción del resultado.

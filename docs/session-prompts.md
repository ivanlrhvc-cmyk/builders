# Prompts estándar de sesión

> Copiar y pegar al inicio de cada sesión según el tipo de trabajo.
> Tres líneas en vez de tres párrafos. Mismo resultado, menos tokens.

---

## Inicio de sesión general

```
Empezamos sesión. Lee CLAUDE.md y MEMORY.md.
El objetivo de hoy es: [DESCRIBIR EN UNA FRASE].
Antes de actuar, confirma que lo tienes claro.
```

---

## Nueva feature

```
Empezamos sesión. Lee CLAUDE.md y MEMORY.md.
Quiero implementar: [DESCRIPCIÓN DE LA FEATURE].
Antes de escribir código: inventario completo de cambios necesarios. 
Espera mi aprobación del inventario antes de implementar.
```

---

## Resolver un bug

```
Empezamos sesión. Lee CLAUDE.md y MEMORY.md.
Bug a resolver: [DESCRIPCIÓN DEL BUG — qué pasa, dónde, cuándo].
Diagnostica primero, propón la solución, espera aprobación.
```

---

## Auditoría técnica

```
Empezamos sesión. Lee CLAUDE.md y MEMORY.md.
Ejecuta auditoría técnica completa del proyecto.
Cubre: seguridad, lógica, rendimiento, UX, deuda técnica.
Formato: tabla con severidad, descripción y solución.
CRÍTICO y ALTO se resuelven hoy. MEDIO y BAJO van a deuda técnica.
```

---

## Pre-deploy

```
Empezamos sesión. Lee CLAUDE.md y MEMORY.md.
Preparamos deploy a producción.
Revisa docs/deploy-checklist.md completo.
Resuelve todo lo que no esté marcado antes de deployar.
```

---

## Refactorización

```
Empezamos sesión. Lee CLAUDE.md y MEMORY.md.
Quiero refactorizar: [QUÉ Y POR QUÉ].
Inventario de archivos afectados primero.
No cambies comportamiento, solo estructura.
Espera aprobación antes de implementar.
```

---

## Cierre de sesión

```
Cierra la sesión:
1. Guarda memoria con el estado actual del proyecto
2. Lista qué cambió hoy en CHANGELOG.md
3. Actualiza deuda técnica en CLAUDE.md si aplica
4. Confirma build limpio
```

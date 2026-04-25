# Checklist pre-deploy

> Revisar completamente antes de cada deploy a producción. Sin excepciones.

---

## Código

- [ ] Sin errores en consola del navegador
- [ ] Sin warnings de React en consola
- [ ] Tests pasando (`npm test`)
- [ ] Build limpio sin errores (`npm run build`)
- [ ] Sin `console.log` olvidados en producción

## Seguridad

- [ ] Sin keys ni secrets en el código (buscar: `sk-`, `Bearer`, contraseñas hardcodeadas)
- [ ] `.env.local` no está commiteado (verificar `.gitignore`)
- [ ] `.env.example` actualizado con todas las variables necesarias
- [ ] Links externos tienen `rel="noopener noreferrer"`
- [ ] Formularios validan input antes de enviar

## SEO y metadatos

- [ ] `<title>` descriptivo y único
- [ ] `<meta name="description">` entre 120-160 caracteres
- [ ] `og:title` definido
- [ ] `og:description` definido
- [ ] `og:image` definido (mínimo 1200x630px)
- [ ] Favicon configurado

## UI / UX

- [ ] Responsive verificado en móvil (375px)
- [ ] Responsive verificado en tablet (768px)
- [ ] Sin scroll horizontal en ningún breakpoint
- [ ] Formulario de contacto funciona y muestra mensaje de éxito
- [ ] Links externos abren en nueva pestaña

## Infraestructura

- [ ] Variables de entorno configuradas en Vercel
- [ ] Dominio personalizado apuntando correctamente
- [ ] Sentry configurado y recibiendo eventos (si aplica)
- [ ] Analytics activo (si aplica)

## Final

- [ ] Preview del deploy revisada antes de publicar
- [ ] URL compartida en redes muestra og:image correctamente
- [ ] CHANGELOG.md actualizado con lo que sale en este deploy

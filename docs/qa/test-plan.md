# Plan de pruebas — Hotel Miranda

## Objetivo

Verificar que la plataforma cumple los criterios de aceptación y no introduce regresiones en web, dashboard o API.

## Capas

| Capa                | Herramienta               | Responsable |
| ------------------- | ------------------------- | ----------- |
| Dominio             | Vitest                    | Senior / QA |
| Aplicación          | Vitest + fakes            | Senior / QA |
| Infraestructura API | Vitest + Postgres de test | Senior      |
| Interface API       | Fastify `inject`          | Senior / QA |
| Adaptadores admin   | Vitest + MSW              | Senior / QA |
| Componentes         | Testing Library           | Senior / QA |
| E2E                 | Playwright                | QA          |
| Accesibilidad       | axe + revisión manual     | QA / Diseño |
| Rendimiento         | Lighthouse CI             | QA / SEO    |

## Entornos

- Local: Docker Compose con Postgres y Mailpit.
- Staging: servidor personal, subdominio de staging.
- Producción: servidor personal, dominios definitivos.

## Flujos críticos

- Login, refresh y logout.
- Crear reserva pública y confirmarla en admin.
- Cambiar estado de reserva.
- Crear/editar habitación con traducciones e imágenes.
- Archivar contacto.
- Restricciones por rol.
- Cambio de idioma ES/EN.
- Formulario de contacto con email.

## Comandos

```bash
npx -y pnpm@12.21.0 lint
npx -y pnpm@12.21.0 typecheck
npx -y pnpm@12.21.0 test
npx -y pnpm@12.21.0 test:e2e
npx -y pnpm@12.21.0 build
npx -y pnpm@12.21.0 depcruise
```

## Criterios de salida

- Todos los tests pasan.
- Sin blockers abiertos.
- Accesibilidad sin errores críticos.
- Lighthouse en objetivo para páginas públicas.
- QA emite PASS.

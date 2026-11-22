# Hotel Miranda

Monorepo de la nueva plataforma de Hotel Miranda:

- `apps/web`: web pública bilingüe ES/EN con Astro.
- `apps/admin`: dashboard interno con React + Vite.
- `apps/api`: API con Fastify + Prisma + PostgreSQL.
- `packages/*`: contratos Zod, cliente OpenAPI, UI y configuración compartida.
- `infra/`: Docker Compose, Nginx Proxy Manager y backups.

## Requisitos

- Node.js 24+
- pnpm 12 (`npx -y pnpm@12.21.0` si no está instalado)
- Docker (para PostgreSQL local y Mailpit)

## Arranque

```bash
npx -y pnpm@12.21.0 install
npx -y pnpm@12.21.0 dev
```

## Documentación

- `docs/adr/`: decisiones de arquitectura.
- `docs/specs/`: especificaciones funcionales.
- `docs/design/`: identidad, tokens y QA visual.
- `docs/qa/`: plan de pruebas.
- `docs/seo/`: SEO técnico y local.
- `docs/runbooks/`: despliegue, backups y operación.

## Estado

Plataforma desplegada en un servidor personal con Docker y Nginx Proxy Manager:

- Web pública bilingüe con habitaciones reales desde PostgreSQL.
- Dashboard en modo demo (`admin@miranda.test` / `Admin1234!`).
- API con autenticación JWT, RBAC y reservas sin solapamientos.
- 76 tests de API, 6 E2E con Playwright, lint, typecheck, build y `depcruise` en verde.

## Producción

- Web pública: <https://miranda.blancodev.es>
- Dashboard: <https://admin.miranda.blancodev.es>
- API: <https://api.miranda.blancodev.es/health>

El dashboard está en modo demo (`admin@miranda.test` / `Admin1234!`). La web lee habitaciones reales del API.

## Proyectos antiguos

`dashboard-miranda/`, `Hotel-Miranda-HTML/` y `Miranda-Backend/` se conservan intactos como referencia y están ignorados por Git.

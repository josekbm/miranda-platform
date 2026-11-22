# Infraestructura

## Desarrollo local

```bash
docker compose -f infra/docker-compose.yml up -d
```

Servicios:

- PostgreSQL 18 en `localhost:5432` (`miranda` / `miranda`).
- Mailpit SMTP en `localhost:1025`.
- Mailpit UI en <http://localhost:8025>.

## Producción

```bash
cp infra/.env.example infra/.env
# editar infra/.env
docker compose -f infra/docker-compose.prod.yml --env-file infra/.env up -d --build
```

Servicios:

- `db`: PostgreSQL 18, solo red interna, volumen `pgdata`.
- `api`: Fastify + Prisma; ejecuta `prisma migrate deploy` al arrancar.
- `web`: Astro SSR en el puerto 4321.
- `admin`: build estático servido por Nginx en el puerto 80.

NPM debe estar conectado a una red externa compartida (por defecto `npm_proxy`,
configurable con `NPM_NETWORK` en `infra/.env`).

Proxy hosts:

| Dominio                       | Destino    |
| ----------------------------- | ---------- |
| `miranda.tudominio.com`       | `web:4321` |
| `admin.miranda.tudominio.com` | `admin:80` |
| `api.miranda.tudominio.com`   | `api:3000` |

## Seed de demo

```bash
docker compose -f infra/docker-compose.prod.yml exec api \
  ./node_modules/.bin/prisma db seed
```

## Backups

```bash
COMPOSE_FILE=infra/docker-compose.prod.yml \
BACKUP_DIR=/ruta/backups/miranda \
./infra/scripts/backup.sh
```

Ver `docs/runbooks/deploy.md` y `docs/runbooks/backup-restore.md`.

# Runbook — Despliegue

## Requisitos

- Docker y Docker Compose en el servidor.
- Nginx Proxy Manager funcionando.
- Dominio y DNS configurados.
- Red Docker compartida con NPM. Si no existe:

  ```bash
  docker network create npm_proxy
  docker network connect npm_proxy <contenedor-de-npm>
  ```

  Si tu NPM usa otra red, cambia `NPM_NETWORK` en `infra/.env`.

## 1. Preparar el entorno

```bash
cd ruta/al/proyecto
cp infra/.env.example infra/.env
nano infra/.env
```

Cambia como mínimo:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `WEB_URL`, `ADMIN_URL`, `API_URL`, `CORS_ORIGINS`
- `SMTP_*` y `MAIL_FROM`
- `VITE_DEMO_MODE=true` mientras el dashboard use datos demo.

## 2. Construir y arrancar

```bash
docker compose -f infra/docker-compose.prod.yml --env-file infra/.env up -d --build
```

Servicios:

- `db`: PostgreSQL 18, solo red interna. El volumen va en `/var/lib/postgresql` (Postgres 18+).
- `api`: Fastify, migraciones al arrancar.
- `web`: Astro SSR.
- `admin`: React estático servido por Nginx.

Comprobar:

```bash
docker compose -f infra/docker-compose.prod.yml --env-file infra/.env ps
docker compose -f infra/docker-compose.prod.yml --env-file infra/.env logs -f api
```

## 3. Seed de demo

```bash
docker compose -f infra/docker-compose.prod.yml --env-file infra/.env exec -T \
  -e SEED_FORCE=true api ./node_modules/.bin/prisma db seed
```

Usuarios demo:

- `admin@miranda.test` / `Admin1234!`
- `manager@miranda.test` / `Manager1234!`
- `reception@miranda.test` / `Reception1234!`

> El seed resetea las tablas. No ejecutarlo con datos reales.

## 4. Nginx Proxy Manager

Crear tres proxy hosts.

### Web pública

- Domain: `miranda.tudominio.com`
- Scheme: `http`
- Forward Hostname/IP: `web`
- Forward Port: `4321`
- Block Common Exploits: on
- Websockets Support: on
- SSL: Request new certificate, Force SSL, HTTP/2, HSTS.

### Dashboard

- Domain: `admin.miranda.tudominio.com`
- Scheme: `http`
- Forward Hostname/IP: `admin`
- Forward Port: `80`
- SSL: Request new certificate, Force SSL, HTTP/2, HSTS.

### API

- Domain: `api.miranda.tudominio.com`
- Scheme: `http`
- Forward Hostname/IP: `api`
- Forward Port: `3000`
- Custom Nginx Configuration:

  ```nginx
  client_max_body_size 10m;
  location /api/v1/public/ {
      return 404;
  }
  ```
- SSL: Request new certificate, Force SSL, HTTP/2, HSTS.
- Proteger `/docs` con Access List si se publica.

La web llama al API por la red interna (`http://api:3000`), así que el bloqueo de `/api/v1/public/` no afecta a la web.

## 5. Verificar

```bash
curl -I https://miranda.tudominio.com
curl -I https://admin.miranda.tudominio.com
curl https://api.miranda.tudominio.com/health
```

Dentro de la red:

```bash
docker run --rm --network npm_proxy curlimages/curl -s http://api:3000/health
```

## 6. Actualizar

```bash
git pull
docker compose -f infra/docker-compose.prod.yml --env-file infra/.env up -d --build
```

## 7. Backups

```bash
COMPOSE_FILE=infra/docker-compose.prod.yml \
BACKUP_DIR=/ruta/backups/miranda \
./infra/scripts/backup.sh
```

Programar en cron y copiar fuera del servidor.

## 8. Rollback

Pendiente de etiquetar imágenes por commit. Mientras tanto:

1. Volver al commit anterior.
2. Reconstruir.
3. Restaurar el último backup si la migración fue destructiva.

## Notas

- El dashboard funciona en modo demo (`VITE_DEMO_MODE=true`) con datos mock.
- La web pública lee habitaciones reales del API; si el API no responde, usa el catálogo estático de respaldo.
- Postgres 18+ requiere montar el volumen en `/var/lib/postgresql`, no en `/var/lib/postgresql/data`.

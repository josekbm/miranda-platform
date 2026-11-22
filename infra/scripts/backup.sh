#!/usr/bin/env bash
set -euo pipefail

# Backup de Postgres y uploads.
# Uso: BACKUP_DIR=/ruta/backups ./infra/scripts/backup.sh

COMPOSE_FILE="${COMPOSE_FILE:-infra/docker-compose.yml}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

echo "==> Backup de Postgres"
docker compose -f "$COMPOSE_FILE" exec -T db \
  pg_dump -U miranda -d miranda -Fc \
  > "$BACKUP_DIR/miranda-$STAMP.dump"

echo "==> Backup de uploads"
if docker compose -f "$COMPOSE_FILE" ps uploads >/dev/null 2>&1; then
  docker run --rm \
    -v miranda_uploads:/data:ro \
    -v "$(pwd)/$BACKUP_DIR":/backup \
    alpine:3.21 \
    tar czf "/backup/uploads-$STAMP.tar.gz" -C /data .
else
  echo "    (servicio uploads no encontrado; se omite)"
fi

echo "==> Limpieza de backups con más de $RETENTION_DAYS días"
find "$BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -delete

echo "==> Hecho: $BACKUP_DIR"

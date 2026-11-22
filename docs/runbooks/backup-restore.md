# Runbook — Backup y restauración

> Pendiente de completar en la fase 5.

## Backup

- `pg_dump -Fc` de la base `miranda`.
- `tar` del volumen `uploads`.
- Retención 7 diarios / 4 semanales / 6 mensuales.
- Copia fuera del servidor.

## Restauración

1. Detener API.
2. Restaurar dump en una base limpia.
3. Restaurar volumen de uploads.
4. Arrancar API.
5. Verificar healthcheck y datos.

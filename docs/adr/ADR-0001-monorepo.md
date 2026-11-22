# ADR-0001 — Monorepo con pnpm y Turborepo

- **Fecha:** 2026-11-21
- **Estado:** aceptado
- **Decisores:** equipo Miranda

## Contexto

El proyecto original estaba dividido en tres repositorios: web estática, dashboard y API. Compartir tipos, contratos y configuración entre ellos era manual y propenso a errores. La API antigua está caída y no hay datos productivos que migrar.

## Decisión

Crear un monorepo con pnpm workspaces y Turborepo:

- `apps/web`, `apps/admin`, `apps/api`.
- `packages/contract`, `api-client`, `ui`, `config`.
- Biome para lint/format.
- dependency-cruiser para imponer la dependency rule hexagonal.

Los proyectos antiguos se conservan intactos en sus carpetas y se ignoran por Git.

## Alternativas consideradas

- Tres repos separados con un paquete compartido publicado: más fricción y versionado.
- Un repo sin workspaces: menos escalable y sin caché de tareas.
- Mantener la estructura antigua: no resuelve la duplicación ni la deuda técnica.

## Consecuencias

### Positivas

- Tipos y contratos compartidos.
- Un solo CI y una sola configuración.
- Caché de builds y tests con Turborepo.
- Refactors atómicos entre apps.

### Negativas

- El repositorio crece y hay que cuidar los límites entre paquetes.
- Requiere disciplina con la dependency rule.
- Los agentes deben respetar ownership por capas.

## Referencias

- `pnpm-workspace.yaml`
- `turbo.json`
- `package.json`

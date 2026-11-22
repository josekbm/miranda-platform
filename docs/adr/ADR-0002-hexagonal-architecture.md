# ADR-0002 — Arquitectura hexagonal pragmática

- **Fecha:** 2026-11-21
- **Estado:** aceptado
- **Decisores:** equipo Miranda

## Contexto

El dashboard y la API tienen reglas que no son triviales: disponibilidad de habitaciones, cálculo de precios, transiciones de estado de reserva, permisos por rol y auditoría. En el proyecto original esas reglas estaban repartidas entre controladores, componentes y utilidades, lo que dificultaba testearlas y cambiarlas.

## Decisión

Aplicar arquitectura hexagonal en los bounded contexts con reglas de negocio:

- `bookings`
- `rooms`
- `auth/users`
- `stats` (solo como read model)

Capas:

- `domain`: entidades, value objects, reglas y puertos. Sin frameworks.
- `application`: casos de uso. Depende de dominio y puertos.
- `infrastructure`: Prisma, HTTP, email, storage, reloj, IDs.
- `interface` / `presentation`: rutas Fastify y componentes React.

Reglas:

- El dominio no importa Fastify, Prisma, React, TanStack, `fetch` ni Zod.
- La aplicación no importa infraestructura ni interfaces.
- La infraestructura implementa puertos.
- La presentación depende de la aplicación; el composition root inyecta adaptadores.
- `dependency-cruiser` falla el build si se rompe la regla.

En el dashboard se aplica la misma idea:

- `domain`: entidades y reglas puras.
- `application`: casos de uso y puertos.
- `infrastructure`: adaptadores HTTP con `openapi-fetch`, token store, query client.
- `presentation`: rutas, componentes, hooks y formularios.

## Alcance

Se aplica a los contextos con reglas. Los CRUD triviales y las pantallas de solo lectura pueden usar una estructura más delgada para evitar sobreingeniería.

## Consecuencias

### Positivas

- Reglas testeables sin base de datos, HTTP ni React.
- Adaptadores sustituibles.
- Trabajo paralelo entre agentes por capas.
- Menos lógica duplicada.

### Negativas

- Más archivos y ceremonia.
- Requiere disciplina y revisión de límites.
- Riesgo de sobreingeniería si se aplica a todo.

## Referencias

- `.dependency-cruiser.cjs`
- `apps/api/src/modules/bookings/`
- `apps/admin/src/domain/`

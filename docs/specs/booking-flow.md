# Especificación — Flujo de reservas

## Objetivo

Permitir que un huésped solicite una reserva desde la web pública y que el equipo la gestione desde el dashboard, sin dobles reservas y con precios calculados en servidor.

## Estados

```
PENDING ──► CONFIRMED ──► CHECKED_IN ──► CHECKED_OUT
   │            │
   │            ├──► CANCELLED
   │            └──► NO_SHOW
   └──► CANCELLED
```

Estados terminales: `CHECKED_OUT`, `CANCELLED`, `NO_SHOW`.

## Reglas

- La reserva nace en `PENDING`.
- Solo se confirma, cancela o marca no-show desde los estados permitidos.
- La disponibilidad se calcula por habitación y rango `[checkIn, checkOut)`.
- Una reserva `PENDING`, `CONFIRMED` o `CHECKED_IN` bloquea disponibilidad.
- `CANCELLED` y `NO_SHOW` no bloquean.
- El precio se calcula en servidor: `precio_con_descuento × noches`.
- La constraint de exclusión de Postgres es la última barrera contra solapamientos.
- El huésped recibe email al solicitar y al confirmar.
- El equipo puede ver, filtrar y cambiar estado desde el dashboard.

## Creación

Entrada:

- `roomId`
- `guestName`
- `guestEmail`
- `guestPhone`
- `checkIn` (`YYYY-MM-DD`)
- `checkOut` (`YYYY-MM-DD`)
- `guests` (opcional)
- `specialRequests` (opcional)
- `source` (opcional; por defecto `WEBSITE`)

Validaciones:

- Fechas válidas y `checkOut > checkIn`.
- Habitación existente y activa.
- Huéspedes ≤ capacidad.
- Nombre, email y teléfono válidos.
- Sin solapamiento con reservas activas.

Errores:

| Código                      | HTTP | Cuándo                                 |
| --------------------------- | ---- | -------------------------------------- |
| `INVALID_DATE_RANGE`        | 422  | Fechas inválidas o rango vacío         |
| `BOOKING_VALIDATION`        | 422  | Datos de huésped o capacidad inválidos |
| `ROOM_NOT_FOUND`            | 404  | Habitación inexistente o inactiva      |
| `ROOM_NOT_AVAILABLE`        | 409  | Solapamiento                           |
| `BOOKING_NOT_FOUND`         | 404  | Reserva inexistente                    |
| `INVALID_STATUS_TRANSITION` | 409  | Transición no permitida                |

## Permisos

| Acción          | ADMIN | MANAGER | RECEPTIONIST |
| --------------- | ----- | ------- | ------------ |
| Ver reservas    | ✅    | ✅      | ✅           |
| Crear/editar    | ✅    | ✅      | ✅           |
| Cambiar estado  | ✅    | ✅      | ✅           |
| Cancelar/borrar | ✅    | ✅      | ❌           |

## Tests

- Unitarios de `DateRange`, `BookingStatus`, `Booking` y pricing.
- Casos de uso con repositorios en memoria.
- Integración con Prisma y constraint de exclusión.
- E2E: reserva pública → confirmación en admin.

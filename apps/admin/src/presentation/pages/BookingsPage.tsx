import { Download, Eye, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type BookingStatus,
  bookingStatusLabels,
  nextStatuses,
} from "../../domain/bookings/status";
import type { AdminBooking } from "../../domain/bookings/types";
import {
  formatCurrency,
  formatDateRange,
  nightsBetween,
  nightsLabel,
} from "../../domain/shared/format";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { BookingStatusBadge } from "../components/ui/StatusBadge";
import { useBookings, useUpdateBookingStatus } from "../hooks/useAdminData";

const tabs: { key: BookingStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "Todas" },
  { key: "PENDING", label: "Pendientes" },
  { key: "CONFIRMED", label: "Confirmadas" },
  { key: "CHECKED_IN", label: "En casa" },
  { key: "CHECKED_OUT", label: "Finalizadas" },
];

const skeletonRows = ["s1", "s2", "s3", "s4", "s5", "s6"];

function actionVariant(status: BookingStatus): "primary" | "secondary" | "danger" {
  if (status === "CANCELLED") return "danger";
  if (status === "CHECKED_OUT" || status === "NO_SHOW") return "secondary";
  return "primary";
}

export function BookingsPage() {
  const [status, setStatus] = useState<BookingStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [updating, setUpdating] = useState(false);
  const bookings = useBookings({ status, search });
  const updateStatus = useUpdateBookingStatus();

  const rows = bookings.data ?? [];
  const countByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const booking of rows) {
      counts[booking.status] = (counts[booking.status] ?? 0) + 1;
    }
    return counts;
  }, [rows]);

  const handleUpdate = async (booking: AdminBooking, next: BookingStatus) => {
    setUpdating(true);

    try {
      await updateStatus.mutateAsync({ id: booking.id, status: next });
      toast.success("Reserva actualizada");
      setSelected(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la reserva");
    } finally {
      setUpdating(false);
    }
  };

  const exportCsv = () => {
    const header = [
      "Referencia",
      "Huésped",
      "Email",
      "Llegada",
      "Salida",
      "Habitación",
      "Estado",
      "Total",
    ];
    const lines = rows.map((booking) => [
      booking.reference,
      booking.guestName,
      booking.guestEmail,
      booking.checkIn,
      booking.checkOut,
      `${booking.roomName} (${booking.roomNumber})`,
      bookingStatusLabels[booking.status],
      (booking.totalCents / 100).toFixed(2),
    ]);
    const csv = [header, ...lines]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "reservas-miranda.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-admin-fade">
      <PageHeader
        eyebrow="Operaciones"
        title="Reservas"
        description="Gestiona llegadas, salidas y estados. Todo lo que el equipo necesita para el día."
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={rows.length === 0}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        }
      />

      <div className="admin-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((tab) => {
              const active = status === tab.key;
              const count = tab.key === "ALL" ? rows.length : (countByStatus[tab.key] ?? 0);

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatus(tab.key)}
                  className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-primary text-background"
                      : "text-muted hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 ${active ? "text-background/60" : "text-muted/60"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="relative w-full lg:w-72">
            <span className="sr-only">Buscar reservas</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por huésped, referencia o habitación"
              className="admin-input pl-9"
            />
          </label>
        </div>

        {bookings.isLoading ? (
          <div className="space-y-3 p-4">
            {skeletonRows.map((key) => (
              <div key={key} className="h-14 animate-pulse rounded-xl bg-surface-muted" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Search}
              title="No hay reservas que coincidan"
              description="Prueba con otro estado o limpia la búsqueda para ver todas las reservas."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    setStatus("ALL");
                  }}
                >
                  Limpiar filtros
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-surface-muted/60">
                <tr>
                  <th className="admin-table-head px-4 py-3">Huésped</th>
                  <th className="admin-table-head px-4 py-3">Estancia</th>
                  <th className="admin-table-head px-4 py-3">Habitación</th>
                  <th className="admin-table-head px-4 py-3">Estado</th>
                  <th className="admin-table-head px-4 py-3 text-right">Total</th>
                  <th className="admin-table-head px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-t border-border transition hover:bg-surface-muted/40"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{booking.guestName}</p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {booking.reference} · {booking.guestEmail}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground">
                        {formatDateRange(booking.checkIn, booking.checkOut)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {nightsLabel(nightsBetween(booking.checkIn, booking.checkOut))}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground">{booking.roomName}</p>
                      <p className="mt-0.5 text-[11px] text-muted">Nº {booking.roomNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {formatCurrency(booking.totalCents)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        className="px-3 py-2"
                        onClick={() => setSelected(booking)}
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={selected?.guestName ?? ""}
        description={selected ? `${selected.reference} · ${selected.roomName}` : undefined}
        size="lg"
        footer={
          selected ? (
            <>
              {nextStatuses(selected.status).map((next) => (
                <Button
                  key={next}
                  variant={actionVariant(next)}
                  disabled={updating}
                  onClick={() => void handleUpdate(selected, next)}
                >
                  {bookingStatusLabels[next]}
                </Button>
              ))}
              <Button variant="ghost" onClick={() => setSelected(null)}>
                Cerrar
              </Button>
            </>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <BookingStatusBadge status={selected.status} />
              <span className="text-xs text-muted">Origen: {selected.source}</span>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-surface-muted/60 p-4">
                <dt className="admin-label">Estancia</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {formatDateRange(selected.checkIn, selected.checkOut)}
                </dd>
                <dd className="mt-0.5 text-[11px] text-muted">
                  {nightsLabel(nightsBetween(selected.checkIn, selected.checkOut))}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-muted/60 p-4">
                <dt className="admin-label">Total</dt>
                <dd className="mt-1 font-display text-2xl text-foreground">
                  {formatCurrency(selected.totalCents)}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-muted/60 p-4">
                <dt className="admin-label">Contacto</dt>
                <dd className="mt-1 text-sm text-foreground">{selected.guestEmail}</dd>
                <dd className="mt-0.5 text-[11px] text-muted">{selected.guestPhone}</dd>
              </div>
              <div className="rounded-xl bg-surface-muted/60 p-4">
                <dt className="admin-label">Habitación</dt>
                <dd className="mt-1 text-sm text-foreground">{selected.roomName}</dd>
                <dd className="mt-0.5 text-[11px] text-muted">Nº {selected.roomNumber}</dd>
              </div>
            </dl>

            <div>
              <p className="admin-label">Peticiones especiales</p>
              <p className="mt-2 rounded-xl border border-border bg-surface p-4 text-sm leading-6 text-muted">
                {selected.specialRequests || "Sin peticiones especiales."}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

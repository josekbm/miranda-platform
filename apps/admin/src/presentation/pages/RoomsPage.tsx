import { BedDouble, ExternalLink, Sparkles, Users } from "lucide-react";
import { formatCurrency, guestsLabel } from "../../domain/shared/format";
import { publicSiteUrl } from "../../infrastructure/config";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { HousekeepingBadge } from "../components/ui/StatusBadge";
import { useRooms } from "../hooks/useAdminData";

const skeletonCards = ["c1", "c2", "c3", "c4"];

export function RoomsPage() {
  const rooms = useRooms();
  const data = rooms.data ?? [];
  const ready = data.filter((room) => room.housekeeping === "READY").length;
  const occupied = data.filter((room) => room.housekeeping === "OCCUPIED").length;
  const cleaning = data.filter((room) => room.housekeeping === "CLEANING").length;

  return (
    <div className="space-y-6 animate-admin-fade">
      <PageHeader
        eyebrow="Inventario"
        title="Habitaciones"
        description="Estado de la casa, tarifas y ocupación. Una vista rápida para recepción y housekeeping."
        actions={
          <Button
            variant="secondary"
            onClick={() => window.open(`${publicSiteUrl}/habitaciones`, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Ver en la web
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total",
            value: data.length,
            icon: BedDouble,
            tone: "bg-primary/10 text-primary",
          },
          { label: "Listas", value: ready, icon: Sparkles, tone: "bg-success/10 text-success" },
          { label: "Ocupadas", value: occupied, icon: Users, tone: "bg-primary/10 text-primary" },
          {
            label: "En limpieza",
            value: cleaning,
            icon: Sparkles,
            tone: "bg-warning/10 text-warning",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="admin-card flex items-center gap-4 p-5">
              <span className={`grid h-11 w-11 place-items-center rounded-full ${item.tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="admin-label">{item.label}</p>
                <p className="mt-1 font-display text-3xl text-foreground">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {rooms.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {skeletonCards.map((key) => (
            <div key={key} className="h-72 animate-pulse rounded-2xl bg-surface-muted" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title="No hay habitaciones"
          description="Cuando añadas habitaciones al inventario aparecerán aquí."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((room) => (
            <article key={room.id} className="admin-card overflow-hidden">
              <div className="relative aspect-[16/8] overflow-hidden bg-surface-muted">
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                  <HousekeepingBadge
                    status={room.housekeeping}
                    className="bg-white/90 shadow-sm backdrop-blur"
                  />
                  {room.discountPct > 0 && (
                    <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-900">
                      -{room.discountPct}%
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="admin-label">
                      {room.typeLabel} · Nº {room.roomNumber}
                    </p>
                    <h2 className="mt-1.5 font-display text-2xl text-foreground">{room.name}</h2>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl text-foreground">
                      {formatCurrency(Math.round(room.priceCents * (1 - room.discountPct / 100)))}
                    </p>
                    <p className="text-[10px] text-muted">por noche</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full border border-border px-2.5 py-1 text-[10px] text-muted"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
                  <span>Capacidad {guestsLabel(room.capacity)}</span>
                  <span>{room.guestName ? `Huésped: ${room.guestName}` : "Sin huésped"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

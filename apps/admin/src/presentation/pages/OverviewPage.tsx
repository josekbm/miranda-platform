import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BedDouble, CalendarDays, Euro, LogIn, LogOut, Mail, Plus } from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatCurrency,
  formatDateRange,
  formatShortDate,
  monthLabel,
} from "../../domain/shared/format";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { BookingStatusBadge, ContactStatusBadge } from "../components/ui/StatusBadge";
import { useBookings, useContacts, useOverview } from "../hooks/useAdminData";
import { useAuth } from "../providers/AuthProvider";

const chartColors = {
  primary: "#1F4E5A",
  accent: "#C9A96A",
  grid: "#E8DCCB",
  text: "#6E675D",
};

const kpiSkeletons = ["k1", "k2", "k3", "k4"];

export function OverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const overview = useOverview();
  const bookings = useBookings({});
  const contacts = useContacts();

  const loading = overview.isLoading || bookings.isLoading || contacts.isLoading;
  const error = overview.isError || bookings.isError || contacts.isError;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-2xl bg-surface-muted" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpiSkeletons.map((key) => (
            <div key={key} className="h-36 animate-pulse rounded-2xl bg-surface-muted" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-surface-muted" />
      </div>
    );
  }

  if (error || !overview.data) {
    return (
      <div className="admin-card p-8 text-center">
        <p className="font-display text-2xl text-foreground">No se pudo cargar el dashboard</p>
        <p className="mt-2 text-sm text-muted">Recarga la página para volver a intentarlo.</p>
      </div>
    );
  }

  const data = overview.data;
  const upcoming = (bookings.data ?? [])
    .filter((booking) => !["CHECKED_OUT", "CANCELLED", "NO_SHOW"].includes(booking.status))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    .slice(0, 5);
  const recentContacts = contacts.data?.slice(0, 4) ?? [];
  const firstName = user?.name.split(" ")[0] ?? "equipo";

  return (
    <div className="space-y-6 animate-admin-fade">
      <PageHeader
        eyebrow={monthLabel()}
        title={`Buenos días, ${firstName}.`}
        description="Esto es lo que está pasando hoy en el hotel. Todo lo importante, en un vistazo."
        actions={
          <Button onClick={() => void navigate({ to: "/bookings" })}>
            <Plus className="h-4 w-4" />
            Nueva reserva
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Llegadas hoy"
          value={String(data.arrivalsToday)}
          hint="Reservas confirmadas o pendientes"
          icon={LogIn}
          tone="primary"
        />
        <StatCard
          label="Salidas hoy"
          value={String(data.departuresToday)}
          hint="Habitaciones a revisar"
          icon={LogOut}
          tone="accent"
        />
        <StatCard
          label="Ocupación"
          value={`${data.occupancyPct}%`}
          hint={`${data.totalBookings} reservas en total`}
          icon={BedDouble}
          tone="success"
        />
        <StatCard
          label="Ingresos del mes"
          value={formatCurrency(data.revenueMonthCents)}
          hint="Reservas no canceladas"
          icon={Euro}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="admin-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl text-foreground">Ingresos y ocupación</h2>
              <p className="mt-1 text-sm text-muted">Últimos 7 días</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Ingresos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Ocupación
              </span>
            </div>
          </div>

          <div className="mt-6 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.weekly} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `${Math.round(value / 100)} €`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fill: chartColors.text, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FFFFFF",
                    border: `1px solid ${chartColors.grid}`,
                    borderRadius: 12,
                    fontSize: 12,
                    color: "#1D1B18",
                  }}
                  formatter={(value, name) =>
                    name === "revenueCents"
                      ? [formatCurrency(Number(value)), "Ingresos"]
                      : [`${value}%`, "Ocupación"]
                  }
                />
                <Bar
                  yAxisId="right"
                  dataKey="occupancyPct"
                  fill={chartColors.accent}
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                  opacity={0.7}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenueCents"
                  stroke={chartColors.primary}
                  strokeWidth={2.5}
                  fill={chartColors.primary}
                  fillOpacity={0.1}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-foreground">Próximas reservas</h2>
                <p className="mt-1 text-sm text-muted">Las siguientes llegadas</p>
              </div>
              <Link
                to="/bookings"
                className="text-xs font-semibold text-muted transition hover:text-foreground"
              >
                Ver todas
              </Link>
            </div>

            <div className="mt-5 divide-y divide-border">
              {upcoming.map((booking) => (
                <div key={booking.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Avatar name={booking.guestName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {booking.guestName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {formatDateRange(booking.checkIn, booking.checkOut)} · {booking.roomNumber}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-foreground">Contactos</h2>
                <p className="mt-1 text-sm text-muted">{data.pendingContacts} sin leer</p>
              </div>
              <Link
                to="/contacts"
                className="text-xs font-semibold text-muted transition hover:text-foreground"
              >
                Ver todos
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-start gap-3">
                  <Avatar name={contact.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {contact.subject}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {contact.name} · {formatShortDate(contact.createdAt)}
                    </p>
                  </div>
                  <ContactStatusBadge status={contact.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/bookings"
          className="admin-card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-accent"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Gestionar reservas</p>
            <p className="mt-0.5 text-xs text-muted">Estados, llegadas y salidas</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted" />
        </Link>

        <Link
          to="/rooms"
          className="admin-card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-accent"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/20 text-ink-900 dark:text-accent">
            <BedDouble className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Estado de habitaciones</p>
            <p className="mt-0.5 text-xs text-muted">Limpieza y ocupación</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted" />
        </Link>

        <Link
          to="/contacts"
          className="admin-card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-accent"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-success/10 text-success">
            <Mail className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Bandeja de contactos</p>
            <p className="mt-0.5 text-xs text-muted">Mensajes de huéspedes</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted" />
        </Link>
      </div>
    </div>
  );
}

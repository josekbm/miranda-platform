import { cn } from "@miranda/ui";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BedDouble,
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  Users,
  X,
} from "lucide-react";
import { publicSiteUrl } from "../../infrastructure/config";
import { Avatar } from "../components/ui/Avatar";
import { useAuth } from "../providers/AuthProvider";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/bookings", label: "Reservas", icon: CalendarDays },
  { to: "/rooms", label: "Habitaciones", icon: BedDouble },
  { to: "/contacts", label: "Contactos", icon: Mail },
  { to: "/users", label: "Equipo", icon: Users },
];

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Manager",
  RECEPTIONIST: "Recepción",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: Props) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await navigate({ to: "/login" });
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-ink-900 text-sand-100 transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3" onClick={onClose}>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-brass-400">
              <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
                <path d="M16 46V18h6l10 16 10-16h6v28h-6V29L32 44 22 29v17z" fill="currentColor" />
              </svg>
            </span>
            <span>
              <span className="block font-display text-lg leading-none text-white">
                Hotel Miranda
              </span>
              <span className="mt-1.5 block text-[8px] font-semibold uppercase tracking-[0.28em] text-white/40">
                Admin
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-4" aria-label="Principal">
          {navigation.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-brass-400" : "")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-4">
          <a
            href={publicSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl px-4 py-3 text-xs text-white/40 transition hover:bg-white/5 hover:text-white"
          >
            Ver web pública
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <Avatar name={user?.name ?? "Admin"} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name ?? "Admin"}</p>
              <p className="truncate text-[11px] text-white/40">
                {user ? roleLabels[user.role] : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="grid h-8 w-8 place-items-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 px-2 text-[10px] text-white/25">© 2026 Hotel Miranda</p>
        </div>
      </aside>
    </>
  );
}

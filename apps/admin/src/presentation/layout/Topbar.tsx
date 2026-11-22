import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { demoMode } from "../../infrastructure/config";
import { Avatar } from "../components/ui/Avatar";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "../providers/ThemeProvider";

interface Props {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: Props) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition hover:bg-surface-muted hover:text-foreground lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              Hotel Miranda
            </p>
            <h2 className="font-display text-xl text-foreground">Panel de gestión</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {demoMode && (
            <span className="hidden rounded-full bg-accent/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-900 sm:inline-flex dark:text-accent">
              Demo
            </span>
          )}

          <label className="relative hidden md:block">
            <span className="sr-only">Buscar</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Buscar reserva, huésped o habitación"
              className="h-10 w-72 rounded-xl border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Notificaciones"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-terracotta-500" />
          </button>

          <div className="ml-1 flex items-center gap-2.5">
            <Avatar name={user?.name ?? "Admin"} size="sm" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-foreground">{user?.name ?? "Admin"}</p>
              <p className="text-[10px] text-muted">{user?.email ?? ""}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

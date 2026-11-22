import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { publicSiteUrl } from "../../infrastructure/config";
import { Button } from "../components/ui/Button";
import { useAuth } from "../providers/AuthProvider";

const loginSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

const demoAccounts = [
  { label: "Admin", email: "admin@miranda.test", password: "Admin1234!" },
  { label: "Manager", email: "manager@miranda.test", password: "Manager1234!" },
  { label: "Recepción", email: "reception@miranda.test", password: "Reception1234!" },
];

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@miranda.test",
      password: "Admin1234!",
    },
  });

  useEffect(() => {
    if (user) {
      void navigate({ to: "/" });
    }
  }, [user, navigate]);

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values.email, values.password);
      toast.success("Bienvenido de nuevo");
      await navigate({ to: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo iniciar sesión");
    }
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-brass-400">
              <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
                <path d="M16 46V18h6l10 16 10-16h6v28h-6V29L32 44 22 29v17z" fill="currentColor" />
              </svg>
            </span>
            <div>
              <p className="font-display text-xl text-white">Hotel Miranda</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/45">
                Admin dashboard
              </p>
            </div>
          </div>

          <div className="max-w-lg">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brass-400">
              Gestión hotelera
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight text-white">
              La casa, en orden. El equipo, tranquilo.
            </h1>
            <p className="mt-6 text-base leading-8 text-white/60">
              Reservas, habitaciones, contactos y equipo en un solo lugar. Menos ruido, más tiempo
              para lo que importa.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/35">
            <span>Hotel Miranda</span>
            <span>·</span>
            <span>Costa Mediterránea</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-brass-400">
                <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M16 46V18h6l10 16 10-16h6v28h-6V29L32 44 22 29v17z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <p className="font-display text-xl text-foreground">Hotel Miranda</p>
            </div>
          </div>

          <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted lg:mt-0">
            Acceso interno
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-foreground">
            Entra en el panel.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Usa tus credenciales de equipo. Si estás probando la demo, puedes entrar con cualquiera
            de las cuentas de abajo.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="admin-label">
                Email
              </label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="admin-input pl-10"
                  placeholder="tu@hotelmiranda.test"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="admin-label">
                Contraseña
              </label>
              <div className="relative mt-2">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="admin-input pl-10 pr-16"
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-foreground"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar al panel"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 rounded-2xl border border-border bg-surface-muted/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Cuentas de demo
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setValue("email", account.email);
                    setValue("password", account.password);
                  }}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium text-foreground transition hover:border-accent hover:bg-accent/10"
                >
                  {account.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted">
              Admin: admin@miranda.test / Admin1234!
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-muted">
            ¿Quieres ver la web pública?{" "}
            <a
              href={publicSiteUrl}
              className="font-semibold text-foreground underline underline-offset-4 hover:text-accent"
            >
              Volver al hotel
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

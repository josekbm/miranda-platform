import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Error 404</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">Esta página no existe.</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        Puede que el enlace haya cambiado o que la página ya no esté disponible.
      </p>
      <Link to="/" className="btn-primary mt-6 inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Volver al dashboard
      </Link>
    </div>
  );
}

import { cn } from "@miranda/ui";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface Props {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "accent";
}

const tones = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  accent: "bg-accent/20 text-ink-900 dark:text-accent",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "primary" }: Props) {
  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="admin-label">{label}</p>
          <p className="mt-3 font-display text-3xl text-foreground">{value}</p>
        </div>
        <span className={cn("grid h-11 w-11 place-items-center rounded-full", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {hint && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
          <TrendingUp className="h-3.5 w-3.5 text-success" />
          {hint}
        </p>
      )}
    </div>
  );
}

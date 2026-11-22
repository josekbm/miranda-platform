import { cn } from "@miranda/ui";
import type { ReactNode } from "react";

export type BadgeTone = "warning" | "success" | "info" | "neutral" | "danger" | "accent";

const tones: Record<BadgeTone, string> = {
  warning: "bg-warning/15 text-warning",
  success: "bg-success/15 text-success",
  info: "bg-primary/15 text-primary",
  neutral: "bg-muted/15 text-muted",
  danger: "bg-danger/15 text-danger",
  accent: "bg-accent/20 text-ink-900 dark:text-accent",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

import {
  type BookingStatus,
  bookingStatusLabels,
  bookingStatusTone,
} from "../../../domain/bookings/status";
import type { AdminContactStatus } from "../../../domain/contacts/types";
import type { AdminRoomHousekeeping } from "../../../domain/rooms/types";
import { Badge } from "./Badge";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge tone={bookingStatusTone[status]}>{bookingStatusLabels[status]}</Badge>;
}

const contactTone: Record<AdminContactStatus, "warning" | "info" | "neutral"> = {
  NEW: "warning",
  READ: "info",
  ARCHIVED: "neutral",
};

const contactLabel: Record<AdminContactStatus, string> = {
  NEW: "Nuevo",
  READ: "Leído",
  ARCHIVED: "Archivado",
};

export function ContactStatusBadge({ status }: { status: AdminContactStatus }) {
  return <Badge tone={contactTone[status]}>{contactLabel[status]}</Badge>;
}

const housekeepingTone: Record<AdminRoomHousekeeping, "success" | "info" | "warning"> = {
  READY: "success",
  OCCUPIED: "info",
  CLEANING: "warning",
};

const housekeepingLabel: Record<AdminRoomHousekeeping, string> = {
  READY: "Lista",
  OCCUPIED: "Ocupada",
  CLEANING: "Limpieza",
};

export function HousekeepingBadge({
  status,
  className,
}: {
  status: AdminRoomHousekeeping;
  className?: string;
}) {
  return (
    <Badge tone={housekeepingTone[status]} className={className}>
      {housekeepingLabel[status]}
    </Badge>
  );
}

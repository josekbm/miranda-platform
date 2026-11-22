export type AdminRoomType = "SINGLE" | "DOUBLE" | "DOUBLE_SUPERIOR" | "SUITE";
export type AdminRoomHousekeeping = "READY" | "OCCUPIED" | "CLEANING";

export interface AdminRoom {
  id: string;
  name: string;
  roomNumber: string;
  type: AdminRoomType;
  typeLabel: string;
  priceCents: number;
  discountPct: number;
  capacity: number;
  image: string;
  amenities: string[];
  isActive: boolean;
  housekeeping: AdminRoomHousekeeping;
  guestName: string | null;
}

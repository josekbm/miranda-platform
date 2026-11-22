import type { AdminBooking } from "../../domain/bookings/types";
import type { AdminContact } from "../../domain/contacts/types";
import type { OverviewStats, WeeklyPoint } from "../../domain/overview/types";
import type { AdminRoom } from "../../domain/rooms/types";
import { addDaysISO, nightsBetween, todayISO } from "../../domain/shared/format";
import type { AdminUser } from "../../domain/users/types";

const today = todayISO();
const yesterday = addDaysISO(-1);
const tomorrow = addDaysISO(1);
const inThreeDays = addDaysISO(3);
const inTenDays = addDaysISO(10);
const fiveDaysAgo = addDaysISO(-5);
const fourDaysAgo = addDaysISO(-4);

const roomImage = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const mockRooms: AdminRoom[] = [
  {
    id: "c0000000-0000-4000-8000-000000000001",
    name: "Habitación Single 101",
    roomNumber: "101",
    type: "SINGLE",
    typeLabel: "Individual",
    priceCents: 8_000,
    discountPct: 0,
    capacity: 1,
    image: roomImage("photo-1505693314120-0d443867891c"),
    amenities: ["Wi-Fi", "TV", "Aire acondicionado"],
    isActive: true,
    housekeeping: "READY",
    guestName: null,
  },
  {
    id: "c0000000-0000-4000-8000-000000000002",
    name: "Habitación Doble 102",
    roomNumber: "102",
    type: "DOUBLE",
    typeLabel: "Doble",
    priceCents: 12_000,
    discountPct: 10,
    capacity: 2,
    image: roomImage("photo-1540518614846-7eded433c457"),
    amenities: ["Wi-Fi", "TV", "Aire acondicionado", "Caja fuerte"],
    isActive: true,
    housekeeping: "OCCUPIED",
    guestName: "Alan Turing",
  },
  {
    id: "c0000000-0000-4000-8000-000000000003",
    name: "Doble Superior 201",
    roomNumber: "201",
    type: "DOUBLE_SUPERIOR",
    typeLabel: "Doble Superior",
    priceCents: 18_000,
    discountPct: 15,
    capacity: 2,
    image: roomImage("photo-1560185893-a55cbc8c57e8"),
    amenities: ["Wi-Fi", "TV", "Minibar", "Caja fuerte"],
    isActive: true,
    housekeeping: "READY",
    guestName: null,
  },
  {
    id: "c0000000-0000-4000-8000-000000000004",
    name: "Suite 301",
    roomNumber: "301",
    type: "SUITE",
    typeLabel: "Suite",
    priceCents: 25_000,
    discountPct: 20,
    capacity: 3,
    image: roomImage("photo-1582719478250-c89cae4dc85b"),
    amenities: ["Wi-Fi", "TV", "Bañera", "Cocina", "Parking"],
    isActive: true,
    housekeeping: "CLEANING",
    guestName: null,
  },
];

const roomById = new Map(mockRooms.map((room) => [room.id, room]));

function booking(
  index: number,
  input: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    status: AdminBooking["status"];
    specialRequests?: string;
    source?: AdminBooking["source"];
  },
): AdminBooking {
  const room = roomById.get(input.roomId);
  const nights = nightsBetween(input.checkIn, input.checkOut);
  const nightly = room ? Math.round(room.priceCents * (1 - room.discountPct / 100)) : 0;

  return {
    id: `e0000000-0000-4000-8000-00000000000${index}`,
    reference: `B-2026-000${index}`,
    guestName: input.guestName,
    guestEmail: input.guestEmail,
    guestPhone: input.guestPhone,
    roomId: input.roomId,
    roomName: room?.name ?? "",
    roomNumber: room?.roomNumber ?? "",
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    status: input.status,
    totalCents: nightly * nights,
    specialRequests: input.specialRequests ?? null,
    source: input.source ?? "WEBSITE",
    createdAt: `${fiveDaysAgo}T10:00:00.000Z`,
  };
}

export const mockBookings: AdminBooking[] = [
  booking(1, {
    guestName: "Ada Lovelace",
    guestEmail: "ada@example.com",
    guestPhone: "+34 600 100 001",
    roomId: "c0000000-0000-4000-8000-000000000001",
    checkIn: today,
    checkOut: tomorrow,
    status: "CONFIRMED",
    specialRequests: "Llegada tardía, sobre las 22:00.",
  }),
  booking(2, {
    guestName: "Grace Hopper",
    guestEmail: "grace@example.com",
    guestPhone: "+34 600 100 002",
    roomId: "c0000000-0000-4000-8000-000000000003",
    checkIn: today,
    checkOut: inThreeDays,
    status: "PENDING",
    specialRequests: "Cuna para bebé.",
  }),
  booking(3, {
    guestName: "Alan Turing",
    guestEmail: "alan@example.com",
    guestPhone: "+34 600 100 003",
    roomId: "c0000000-0000-4000-8000-000000000002",
    checkIn: yesterday,
    checkOut: today,
    status: "CHECKED_IN",
    specialRequests: "Factura a nombre de la empresa.",
  }),
  booking(4, {
    guestName: "Katherine Johnson",
    guestEmail: "katherine@example.com",
    guestPhone: "+34 600 100 004",
    roomId: "c0000000-0000-4000-8000-000000000004",
    checkIn: yesterday,
    checkOut: tomorrow,
    status: "CHECKED_IN",
    specialRequests: "Botella de cava de bienvenida.",
  }),
  booking(5, {
    guestName: "Margaret Hamilton",
    guestEmail: "margaret@example.com",
    guestPhone: "+34 600 100 005",
    roomId: "c0000000-0000-4000-8000-000000000003",
    checkIn: inThreeDays,
    checkOut: addDaysISO(6),
    status: "CONFIRMED",
    specialRequests: "Vista al jardín si es posible.",
    source: "PHONE",
  }),
  booking(6, {
    guestName: "Barbara Liskov",
    guestEmail: "barbara@example.com",
    guestPhone: "+34 600 100 006",
    roomId: "c0000000-0000-4000-8000-000000000001",
    checkIn: fiveDaysAgo,
    checkOut: fourDaysAgo,
    status: "CHECKED_OUT",
    source: "ADMIN",
  }),
  booking(7, {
    guestName: "Joan Clarke",
    guestEmail: "joan@example.com",
    guestPhone: "+34 600 100 007",
    roomId: "c0000000-0000-4000-8000-000000000002",
    checkIn: inTenDays,
    checkOut: addDaysISO(12),
    status: "CANCELLED",
  }),
  booking(8, {
    guestName: "Mary Jackson",
    guestEmail: "mary@example.com",
    guestPhone: "+34 600 100 008",
    roomId: "c0000000-0000-4000-8000-000000000004",
    checkIn: tomorrow,
    checkOut: inThreeDays,
    status: "PENDING",
  }),
];

export const mockContacts: AdminContact[] = [
  {
    id: "f0000000-0000-4000-8000-000000000001",
    name: "Lucía Ferrer",
    email: "lucia@example.com",
    phone: "+34 600 200 001",
    subject: "Late check-in",
    message: "Llegaremos sobre las 23:00. ¿Es posible hacer el check-in más tarde?",
    status: "NEW",
    locale: "es",
    createdAt: `${yesterday}T18:30:00.000Z`,
  },
  {
    id: "f0000000-0000-4000-8000-000000000002",
    name: "James Smith",
    email: "james@example.com",
    phone: "+44 7700 900001",
    subject: "Airport transfer",
    message: "Could you arrange a transfer from the airport for two people?",
    status: "NEW",
    locale: "en",
    createdAt: `${today}T08:15:00.000Z`,
  },
  {
    id: "f0000000-0000-4000-8000-000000000003",
    name: "Marta Ruiz",
    email: "marta@example.com",
    phone: "+34 600 200 003",
    subject: "Group booking",
    message: "We are looking for five rooms for a family reunion in June.",
    status: "READ",
    locale: "es",
    createdAt: `${fiveDaysAgo}T12:00:00.000Z`,
  },
  {
    id: "f0000000-0000-4000-8000-000000000004",
    name: "Oliver Brown",
    email: "oliver@example.com",
    phone: "+44 7700 900004",
    subject: "Spa opening hours",
    message: "What time does the spa open on Sundays?",
    status: "ARCHIVED",
    locale: "en",
    createdAt: `${fourDaysAgo}T09:45:00.000Z`,
  },
  {
    id: "f0000000-0000-4000-8000-000000000005",
    name: "Elena Vidal",
    email: "elena@example.com",
    phone: "+34 600 200 005",
    subject: "Celiac breakfast",
    message: "¿Tenéis opciones sin gluten para el desayuno?",
    status: "READ",
    locale: "es",
    createdAt: `${yesterday}T11:20:00.000Z`,
  },
];

export const mockUsers: AdminUser[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    name: "Miranda Admin",
    email: "admin@miranda.test",
    phone: "+34 600 000 001",
    role: "ADMIN",
    status: "ACTIVE",
    avatarUrl: null,
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    name: "Miranda Manager",
    email: "manager@miranda.test",
    phone: "+34 600 000 002",
    role: "MANAGER",
    status: "ACTIVE",
    avatarUrl: null,
  },
  {
    id: "a0000000-0000-4000-8000-000000000003",
    name: "Miranda Reception",
    email: "reception@miranda.test",
    phone: "+34 600 000 003",
    role: "RECEPTIONIST",
    status: "ACTIVE",
    avatarUrl: null,
  },
  {
    id: "a0000000-0000-4000-8000-000000000004",
    name: "Marta Housekeeping",
    email: "housekeeping@miranda.test",
    phone: "+34 600 000 004",
    role: "RECEPTIONIST",
    status: "INACTIVE",
    avatarUrl: null,
  },
];

const weekdayFormatter = new Intl.DateTimeFormat("es-ES", { weekday: "short" });

function buildWeekly(): WeeklyPoint[] {
  const revenue = [4_200, 5_100, 4_800, 6_200, 5_800, 7_200, 6_800];
  const occupancy = [62, 68, 64, 74, 71, 82, 78];

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const label = weekdayFormatter.format(date).replace(".", "");

    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      revenueCents: (revenue[index] ?? 0) * 100,
      occupancyPct: occupancy[index] ?? 0,
    };
  });
}

export function buildOverview(
  bookings: AdminBooking[],
  rooms: AdminRoom[],
  contacts: AdminContact[],
): OverviewStats {
  const monthPrefix = today.slice(0, 7);
  const active = bookings.filter(
    (item) =>
      item.status === "CHECKED_IN" ||
      (item.status === "CONFIRMED" && item.checkIn <= today && item.checkOut > today),
  );
  const occupancyPct =
    rooms.length === 0 ? 0 : Math.min(100, Math.round((active.length / rooms.length) * 100));

  return {
    arrivalsToday: bookings.filter(
      (item) =>
        item.checkIn === today && (item.status === "CONFIRMED" || item.status === "PENDING"),
    ).length,
    departuresToday: bookings.filter(
      (item) =>
        item.checkOut === today && (item.status === "CHECKED_IN" || item.status === "CONFIRMED"),
    ).length,
    occupancyPct,
    revenueMonthCents: bookings
      .filter(
        (item) =>
          item.status !== "CANCELLED" &&
          item.status !== "NO_SHOW" &&
          item.checkIn.startsWith(monthPrefix),
      )
      .reduce((sum, item) => sum + item.totalCents, 0),
    pendingContacts: contacts.filter((item) => item.status === "NEW").length,
    totalBookings: bookings.length,
    weekly: buildWeekly(),
  };
}

export interface MockStore {
  bookings: AdminBooking[];
  rooms: AdminRoom[];
  contacts: AdminContact[];
  users: AdminUser[];
}

export function createMockStore(): MockStore {
  return {
    bookings: structuredClone(mockBookings),
    rooms: structuredClone(mockRooms),
    contacts: structuredClone(mockContacts),
    users: structuredClone(mockUsers),
  };
}

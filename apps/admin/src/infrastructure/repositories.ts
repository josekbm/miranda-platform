import type {
  AuthGateway,
  AuthSession,
  AuthUser,
  BookingRepository,
  ContactRepository,
  RoomRepository,
  StatsRepository,
  UserRepository,
} from "../application/ports";
import { type BookingStatus, canTransition } from "../domain/bookings/status";
import type { AdminBooking, BookingFilters } from "../domain/bookings/types";
import type { AdminContact, AdminContactStatus } from "../domain/contacts/types";
import type { OverviewStats } from "../domain/overview/types";
import type { AdminRoom } from "../domain/rooms/types";
import type { AdminUser } from "../domain/users/types";
import { clearStoredSession, getStoredSession, setStoredSession } from "./auth/authStorage";
import { buildOverview, createMockStore, type MockStore } from "./mock/data";

export class MockBookingRepository implements BookingRepository {
  constructor(private readonly store: MockStore) {}

  async list(filters: BookingFilters = {}): Promise<AdminBooking[]> {
    const search = filters.search?.trim().toLowerCase();
    const status = filters.status && filters.status !== "ALL" ? filters.status : undefined;
    const priority: Record<BookingStatus, number> = {
      CHECKED_IN: 0,
      CONFIRMED: 1,
      PENDING: 2,
      CHECKED_OUT: 3,
      CANCELLED: 4,
      NO_SHOW: 5,
    };

    return this.store.bookings
      .filter((booking) => {
        if (status && booking.status !== status) return false;
        if (
          search &&
          !`${booking.guestName} ${booking.reference} ${booking.roomNumber}`
            .toLowerCase()
            .includes(search)
        ) {
          return false;
        }
        return true;
      })
      .sort(
        (a, b) => priority[a.status] - priority[b.status] || a.checkIn.localeCompare(b.checkIn),
      );
  }

  async getById(id: string): Promise<AdminBooking | null> {
    return this.store.bookings.find((booking) => booking.id === id) ?? null;
  }

  async updateStatus(id: string, status: BookingStatus): Promise<AdminBooking> {
    const booking = this.store.bookings.find((item) => item.id === id);

    if (!booking) {
      throw new Error("Reserva no encontrada.");
    }

    if (!canTransition(booking.status, status)) {
      throw new Error("Transición de estado no permitida.");
    }

    booking.status = status;
    return { ...booking };
  }
}

export class MockRoomRepository implements RoomRepository {
  constructor(private readonly store: MockStore) {}

  async list(): Promise<AdminRoom[]> {
    return [...this.store.rooms];
  }
}

export class MockContactRepository implements ContactRepository {
  constructor(private readonly store: MockStore) {}

  async list(): Promise<AdminContact[]> {
    return [...this.store.contacts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async updateStatus(id: string, status: AdminContactStatus): Promise<AdminContact> {
    const contact = this.store.contacts.find((item) => item.id === id);

    if (!contact) {
      throw new Error("Contacto no encontrado.");
    }

    contact.status = status;
    return { ...contact };
  }
}

export class MockUserRepository implements UserRepository {
  constructor(private readonly store: MockStore) {}

  async list(): Promise<AdminUser[]> {
    return [...this.store.users];
  }
}

export class MockStatsRepository implements StatsRepository {
  constructor(private readonly store: MockStore) {}

  async getOverview(): Promise<OverviewStats> {
    return buildOverview(this.store.bookings, this.store.rooms, this.store.contacts);
  }
}

interface DemoUser extends AuthUser {
  password: string;
}

const demoUsers: DemoUser[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    name: "Miranda Admin",
    email: "admin@miranda.test",
    role: "ADMIN",
    avatarUrl: null,
    password: "Admin1234!",
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    name: "Miranda Manager",
    email: "manager@miranda.test",
    role: "MANAGER",
    avatarUrl: null,
    password: "Manager1234!",
  },
  {
    id: "a0000000-0000-4000-8000-000000000003",
    name: "Miranda Reception",
    email: "reception@miranda.test",
    role: "RECEPTIONIST",
    avatarUrl: null,
    password: "Reception1234!",
  },
];

export class DemoAuthGateway implements AuthGateway {
  async login(email: string, password: string): Promise<AuthSession> {
    const found = demoUsers.find(
      (user) => user.email === email.trim().toLowerCase() && user.password === password,
    );

    if (!found) {
      throw new Error("Email o contraseña incorrectos.");
    }

    const session: AuthSession = {
      user: {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatarUrl: found.avatarUrl,
      },
      accessToken: "demo-access-token",
    };

    setStoredSession(session);
    return session;
  }

  async logout(): Promise<void> {
    clearStoredSession();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return getStoredSession()?.user ?? null;
  }
}

export function createContainer() {
  const store = createMockStore();

  return {
    auth: new DemoAuthGateway(),
    bookings: new MockBookingRepository(store),
    rooms: new MockRoomRepository(store),
    contacts: new MockContactRepository(store),
    users: new MockUserRepository(store),
    stats: new MockStatsRepository(store),
  };
}

export const container = createContainer();
export type AppContainer = ReturnType<typeof createContainer>;

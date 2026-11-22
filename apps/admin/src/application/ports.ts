import type { BookingStatus } from "../domain/bookings/status";
import type { AdminBooking, BookingFilters } from "../domain/bookings/types";
import type { AdminContact, AdminContactStatus } from "../domain/contacts/types";
import type { OverviewStats } from "../domain/overview/types";
import type { AdminRoom } from "../domain/rooms/types";
import type { AdminRole, AdminUser } from "../domain/users/types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl: string | null;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface AuthGateway {
  login(email: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}

export interface BookingRepository {
  list(filters?: BookingFilters): Promise<AdminBooking[]>;
  getById(id: string): Promise<AdminBooking | null>;
  updateStatus(id: string, status: BookingStatus): Promise<AdminBooking>;
}

export interface RoomRepository {
  list(): Promise<AdminRoom[]>;
}

export interface ContactRepository {
  list(): Promise<AdminContact[]>;
  updateStatus(id: string, status: AdminContactStatus): Promise<AdminContact>;
}

export interface UserRepository {
  list(): Promise<AdminUser[]>;
}

export interface StatsRepository {
  getOverview(): Promise<OverviewStats>;
}

export type AdminRole = "ADMIN" | "MANAGER" | "RECEPTIONIST";
export type AdminUserStatus = "ACTIVE" | "INACTIVE";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: AdminUserStatus;
  avatarUrl: string | null;
}

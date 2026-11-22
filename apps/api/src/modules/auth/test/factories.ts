import { User, type UserProps } from "../domain/User";

export const fixedNow = new Date("2026-11-21T10:00:00.000Z");

export function makeUser(overrides: Partial<UserProps> = {}): User {
  return User.reconstitute({
    id: "00000000-0000-4000-8000-000000000001",
    email: "admin@miranda.test",
    passwordHash: "hashed:Admin1234!",
    name: "Miranda Admin",
    phone: null,
    role: "ADMIN",
    status: "ACTIVE",
    avatarUrl: null,
    createdAt: fixedNow,
    updatedAt: fixedNow,
    ...overrides,
  });
}

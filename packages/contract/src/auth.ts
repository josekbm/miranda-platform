import { z } from "zod";

export const roleSchema = z.enum(["ADMIN", "MANAGER", "RECEPTIONIST"]);
export type Role = z.infer<typeof roleSchema>;

export const userStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);
export type UserStatus = z.infer<typeof userStatusSchema>;

export const publicUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().nullable(),
  role: roleSchema,
  status: userStatusSchema,
  avatarUrl: z.string().url().nullable(),
});
export type PublicUser = z.infer<typeof publicUserSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const refreshSessionInputSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshSessionInput = z.infer<typeof refreshSessionInputSchema>;

export const logoutInputSchema = refreshSessionInputSchema;
export type LogoutInput = z.infer<typeof logoutInputSchema>;

export const authSessionSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  accessTokenExpiresIn: z.number().int().positive(),
  refreshTokenExpiresAt: z.iso.datetime(),
  user: publicUserSchema,
});
export type AuthSession = z.infer<typeof authSessionSchema>;

export const authResponseSchema = z.object({
  data: authSessionSchema.omit({ refreshToken: true }),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const meResponseSchema = z.object({
  data: z.object({
    user: publicUserSchema,
  }),
});
export type MeResponse = z.infer<typeof meResponseSchema>;

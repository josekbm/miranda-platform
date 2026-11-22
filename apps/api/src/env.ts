import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(3000),
  API_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  WEB_URL: z.string().url().default("http://localhost:4321"),
  ADMIN_URL: z.string().url().default("http://localhost:5173"),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:5173")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  JWT_SECRET: z.string().min(16).default("dev-only-secret-change-me"),
  COOKIE_SECRET: z.string().min(16).default("dev-only-cookie-change-me"),
});

export const env = envSchema.parse(process.env);
export type Env = typeof env;

import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string().default("3000"),
  DB_URI: z.string(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
}).passthrough();

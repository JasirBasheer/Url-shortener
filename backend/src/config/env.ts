import { envSchema } from '@/validators';
import dotenv from 'dotenv';
dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Environment validation error:", parsedEnv.error.format());
  process.exit(1);
}


export const env = {
  CONFIG: {
    PORT: parsedEnv.data.PORT,
    DB_URI: parsedEnv.data.DB_URI,
    CORS_ORIGIN: parsedEnv.data.CORS_ORIGIN,
    NODE_ENV: parsedEnv.data.NODE_ENV,
  },

  JWT: {
    ACCESS_SECRET: parsedEnv.data.JWT_ACCESS_SECRET,
    REFRESH_SECRET: parsedEnv.data.JWT_REFRESH_SECRET,
  },

  COOKIE: {
    SECRET: parsedEnv.data.COOKIE_SECRET,
    SECURE: parsedEnv.data.NODE_ENV === 'production',
    SAME_SITE: parsedEnv.data.NODE_ENV === 'production' ? 'strict' : 'lax',
  },

};

import { envSchema } from '@/validators';
import dotenv from 'dotenv';
dotenv.config();

const { value, error } = envSchema.validate(process.env, { 
  abortEarly: false,
  allowUnknown: true,
  convert: true,
});

if (error) {
  console.error("Environment variable validation error:", error.details);
  process.exit(1);
}


export const env = {
  CONFIG: {
    PORT: value.PORT,
    DB_URI: value.DB_URI,
    CORS_ORIGIN: value.CORS_ORIGIN,
    NODE_ENV: value.NODE_ENV,
  },

  JWT: {
    ACCESS_SECRET: value.JWT_ACCESS_SECRET,
    REFRESH_SECRET: value.JWT_REFRESH_SECRET,
    RESET_PASSWORD_SECRET: value.JWT_RESET_PASSWORD_SECRET,
    ACCESS_EXPIRES_IN: value.JWT_ACCESS_EXPIRES_IN,
    REFRESH_EXPIRES_IN: value.JWT_REFRESH_EXPIRES_IN,
  },

  COOKIE: {
    SECRET: value.COOKIE_SECRET,
    SECURE: value.NODE_ENV === 'production',
    SAME_SITE: value.NODE_ENV === 'production' ? 'strict' : 'lax',
  },

  BASE_URLS: {
    FRONTEND: value.FRONTEND_BASE_URL,
  }
};

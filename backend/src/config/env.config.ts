import { envSchema } from '@/domain/validators';
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
    CORS_ORIGINS: value.CORS_ORIGINS,
    TOKEN_SECRET: value.TOKEN_SECRET,
  },

  BASE_URLS: {
    FRONTEND: value.FRONTEND_BASE_URL,
    FACEBOOK: value.FRONTEND_BASE_URL,
    INSTAGRAM: value.FRONTEND_BASE_URL,
    LINKEDIN: value.FRONTEND_BASE_URL,
    X: value.FRONTEND_BASE_URL,
  }
};

import Joi from "joi";
export const envSchema = Joi.object({
  PORT: Joi.string().default("5173"),
  DB_URI: Joi.string().required(),
  CORS_ORIGINS: Joi.string().optional(),

  FRONTEND_BASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_RESET_PASSWORD_SECRET: Joi.string().required(),

}).unknown(); 
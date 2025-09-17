import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { env } from "./config/env.config.js";



export const createApp = () => {
  const app = express();

  app.use(cors({
      origin: env.CONFIG.CORS_ORIGINS.split(","),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
  }))
  app.use(helmet());
  // app.use(limiter);
  app.use(compression());
  app.use(express.json());
  app.use(cookieParser());

  // app.use("/api/", createRoutes());

  return app;
};

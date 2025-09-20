import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { limiter } from "./utils";
import { errorHandler, notFound } from "./middleware/implementation/errorHandler";
import { createAuthRoutes, createUrlRoutes } from "./routes";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(limiter);
  app.use(cors({
    origin: env.CONFIG.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }));

  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());


  app.use("/auth", createAuthRoutes());
  app.use("/urls", createUrlRoutes());
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

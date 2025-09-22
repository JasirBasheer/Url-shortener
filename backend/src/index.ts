import "reflect-metadata";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { registerDependencies } from "./di";
import { Express } from "express-serve-static-core";

let app: Express;

(async () => {
  registerDependencies();
  await connectDB();
  app = createApp();

  app.listen(env.CONFIG.PORT, () => {
    console.log(`Server is running on port ${env.CONFIG.PORT}`);
  });
})();

export default app;

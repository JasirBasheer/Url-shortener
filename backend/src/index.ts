import 'reflect-metadata';
import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { registerDependencies } from './di';


const startServer = async () => {
  try {
    await connectDB();
    registerDependencies();

    const app = createApp()
    app.listen(env.CONFIG.PORT, () => {
      console.log(`Server is running on port ${env.CONFIG.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

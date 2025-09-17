import 'reflect-metadata';
import { connectDB } from './config/db.config';
import { env } from './config/env.config';
import { createApp } from './app';


const startServer = async () => {
  try {
    await connectDB();

    const app = createApp()
    app.listen(env.CONFIG.PORT, () => {
      console.log(` ${env.CONFIG.PORT} `);
    });
  } catch (error) {
    console.error("ERROR_MESSAGES.NETWORK.FAILED_TO_START_SERVER", error);
    process.exit(1);
  }
};

startServer();

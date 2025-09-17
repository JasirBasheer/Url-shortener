import mongoose from 'mongoose';
import { env } from './env.config.js';


export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.CONFIG.DB_URI, {
      autoIndex: true,
    });
  } catch (error) {
    process.exit(1);
  }
};

import mongoose from 'mongoose';
import { env } from './env';


export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.CONFIG.DB_URI);
  } catch (error) {
    console.log(error)
    process.exit(1);
  }
};

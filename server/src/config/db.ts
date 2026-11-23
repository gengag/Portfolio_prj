import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[DATABASE ERROR] MongoDB Connection Failed: ${error.message}`);
    // Don't exit immediately in local dev if MongoDB is temporarily off
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

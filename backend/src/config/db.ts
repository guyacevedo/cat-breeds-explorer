import mongoose from 'mongoose';
import { env } from './env.js';

/** Establishes the MongoDB connection. Single responsibility: connectivity. */
export async function connectDatabase(uri: string = env.mongoUri): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('[db] Connected to MongoDB');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

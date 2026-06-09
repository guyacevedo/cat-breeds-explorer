import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized, strongly-typed access to environment configuration.
 * Fails fast if a required secret is missing (Single Source of Truth).
 */
function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: required('MONGO_URI', 'mongodb://localhost:27017/cat-breeds'),
  catApi: {
    baseUrl: process.env.CAT_API_URL ?? 'https://api.thecatapi.com/v1',
    key: process.env.CAT_API_KEY ?? '',
  },
  jwt: {
    secret: required('JWT_SECRET', 'dev_secret_change_me'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
} as const;

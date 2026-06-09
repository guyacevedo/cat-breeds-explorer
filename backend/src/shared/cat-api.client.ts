import axios, { type AxiosInstance } from 'axios';
import { env } from '../config/env.js';

/**
 * Thin, reusable HTTP client preconfigured for TheCatAPI.
 * The secret API key is injected from the environment (never hardcoded).
 */
export function createCatApiClient(): AxiosInstance {
  return axios.create({
    baseURL: env.catApi.baseUrl,
    timeout: 10_000,
    headers: env.catApi.key ? { 'x-api-key': env.catApi.key } : {},
  });
}

export const catApiClient = createCatApiClient();

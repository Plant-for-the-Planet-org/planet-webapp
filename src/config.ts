import { config } from 'dotenv';

if (process.env.NODE_ENV === 'production') {
  config();
} else {
  config({ path: '.env.local' });
}

export const REDIS_URL = process.env.REDIS_URL;
export const API_ENDPOINT = process.env.API_ENDPOINT;

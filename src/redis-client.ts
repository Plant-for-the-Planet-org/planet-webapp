import { createClient } from '@vercel/kv';

const redisClient = createClient({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export default redisClient;
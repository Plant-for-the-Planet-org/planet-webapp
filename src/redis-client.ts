import { createClient } from '@vercel/kv';

const getRedisClient = () => {
  if (process.env.STORYBOOK_IS_STORYBOOK) {
    return null;
  }

  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined');
  }

  if (!process.env.REDIS_TOKEN) {
    throw new Error('REDIS_TOKEN is not defined');
  }

  const redisClient = createClient({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });

  return redisClient;
};

export default getRedisClient();

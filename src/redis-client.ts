import { createClient } from '@vercel/kv';

const getRedisClient = () => {
  if (process.env.STORYBOOK_IS_STORYBOOK) {
    return null;
  }

  if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
    // In production a missing Redis config is a real misconfiguration.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('REDIS_URL/REDIS_TOKEN is not defined');
    }
    // Locally, degrade gracefully and run without a cache. Callers
    // (cache.ts, multiTenancy/helpers.ts) already handle a null client.
    console.warn(
      'Redis not configured (REDIS_URL/REDIS_TOKEN missing); running without cache.'
    );
    return null;
  }

  const redisClient = createClient({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });

  return redisClient;
};

export default getRedisClient();

import redisClient from '../../redis-client';
import superjson from 'superjson';

const DEFAULT_CACHE_TTL = 5 * 60; // 5 minutes in seconds

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = DEFAULT_CACHE_TTL
): Promise<T> {
  if (!redisClient) {
    return await fetchFn();
  }

  // Try to get data from cache
  const cachedData = await redisClient.get(key);
  if (cachedData) {
    // Ensure we're working with a string before parsing
    const jsonString =
      typeof cachedData === 'string' ? cachedData : JSON.stringify(cachedData);
    return superjson.parse(jsonString);
  }

  // If no cached data, fetch and cache
  const data = await fetchFn();
  // Ensure we're storing a string
  const serialized = superjson.stringify(data);
  await redisClient.set(key, serialized, { ex: ttl });
  return data;
}

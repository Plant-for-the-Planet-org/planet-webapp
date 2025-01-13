import redisClient from '../../redis-client';
import superjson from 'superjson';

const DEFAULT_CACHE_TTL = 5 * 60; // 5 minutes in seconds

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = DEFAULT_CACHE_TTL
): Promise<T> {
  if (!key) {
    throw new Error('Cache key is required');
  }

  if (!redisClient) {
    console.error(
      'Redis client not initialized. If this is not a Storybook environment, please ensure Redis is properly configured and connected.'
    );
    return await fetchFn();
  }

  // Try to get data from cache
  const cachedData = await redisClient.get(key).catch((err) => {
    console.error(`Error fetching cached data: ${err}`);
    throw new Error(`Error fetching cached data`);
  });

  if (cachedData) {
    try {
      // Ensure we're working with a string before parsing
      const jsonString =
        typeof cachedData === 'string'
          ? cachedData
          : JSON.stringify(cachedData);
      return superjson.parse(jsonString);
    } catch (err) {
      console.error(`Error parsing cached data: ${err}`);
      // If we can't parse the cached data, invalidate it
      await redisClient.del(key).catch((deleteError) => {
        console.error(`Error deleting invalid cache: ${deleteError}`);
      });
    }
  }

  // If no cached data, fetch and cache
  const data = await fetchFn().catch((err) => {
    throw new Error(`Error fetching data: ${err}`);
  });

  if (data === undefined || data === null) {
    throw new Error('Error fetching data: missing data');
  }

  try {
    // Ensure we're storing a string
    const serialized = superjson.stringify(data);
    await redisClient.set(key, serialized, { ex: ttl }).catch((err) => {
      console.error(`Error caching data: ${err}`);
    });
  } catch (err) {
    console.error(`Error caching data: ${err}`);
  }
  return data;
}

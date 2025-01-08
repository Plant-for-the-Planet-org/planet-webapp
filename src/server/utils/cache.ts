import redisClient from '../../redis-client';

const DEFAULT_CACHE_TTL = 5 * 60; // 5 minutes in seconds

function deserializeComplexTypes(obj: any): any {
  // Handle direct Map objects
  if (obj && obj._type === 'Map') {
    return new Map(obj.data);
  }

  // Handle Set objects
  if (obj && obj._type === 'Set') {
    return new Set(obj.data);
  }

  // Handle objects containing Maps and Sets
  if (obj && typeof obj === 'object') {
    // Create a new object/array to avoid modifying the original
    const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

    // Process all properties
    for (const key of Object.keys(newObj)) {
      if (newObj[key]?._type === 'Map') {
        newObj[key] = new Map(newObj[key].data);
      } else if (newObj[key]?._type === 'Set') {
        newObj[key] = new Set(newObj[key].data);
      } else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
        newObj[key] = deserializeComplexTypes(newObj[key]);
      }
    }
    return newObj;
  }

  return obj;
}

function serializeComplexTypes(obj: any): any {
  if (obj instanceof Map) {
    return {
      _type: 'Map',
      data: Array.from(obj.entries()),
    };
  }

  if (obj instanceof Set) {
    return {
      _type: 'Set',
      data: Array.from(obj),
    };
  }

  if (obj && typeof obj === 'object') {
    const newObj = { ...obj };
    Object.keys(newObj).forEach((key) => {
      if (newObj[key] instanceof Map || newObj[key] instanceof Set) {
        newObj[key] = serializeComplexTypes(newObj[key]);
      } else if (typeof newObj[key] === 'object') {
        newObj[key] = serializeComplexTypes(newObj[key]);
      }
    });
    return newObj;
  }

  return obj;
}

/**
 *
 * @param key key that will be used to store the data in the cache
 * @param fetchFn function used to fetch fresh data if not found in cache
 * @param ttl time (for the cache) to live in seconds
 * @returns
 */
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
    // Parse the cached string and revive complex types
    return deserializeComplexTypes(cachedData) as T;
  }

  // If no cached data, fetch and cache
  const data = await fetchFn();
  const preparedData = serializeComplexTypes(data);
  await redisClient.set(key, preparedData, { ex: ttl });
  return data;
}

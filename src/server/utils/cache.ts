import redisClient from '../../redis-client';

const DEFAULT_CACHE_TTL = 5 * 60; // 5 minutes in seconds

function isArrayLike(obj: any): boolean {
  // Check if it's an object but not null
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }

  // Check if all keys are numeric indices
  const keys = Object.keys(obj);
  return keys.every((key) => {
    const parsed = parseInt(key, 10);
    return !isNaN(parsed) && parsed >= 0 && parsed.toString() === key;
  });
}

function normalizeArray(obj: any): any {
  if (isArrayLike(obj)) {
    // Convert array-like object to proper array
    const maxIndex = Math.max(...Object.keys(obj).map((k) => parseInt(k, 10)));
    return Array.from({ length: maxIndex + 1 }, (_, i) => obj[i] ?? undefined);
  }
  return obj;
}

function deserializeComplexTypes(obj: any): any {
  // Handle direct Map objects
  if (obj && obj._type === 'Map') {
    return new Map(obj.data);
  }

  // Handle Set objects
  if (obj && obj._type === 'Set') {
    return new Set(obj.data);
  }

  // Handle objects containing Maps, Sets, Arrays
  if (obj && typeof obj === 'object') {
    const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key of Object.keys(newObj)) {
      if (newObj[key]?._type === 'Map') {
        newObj[key] = new Map(newObj[key].data);
      } else if (newObj[key]?._type === 'Set') {
        newObj[key] = new Set(newObj[key].data);
      } else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
        newObj[key] = deserializeComplexTypes(normalizeArray(newObj[key]));
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

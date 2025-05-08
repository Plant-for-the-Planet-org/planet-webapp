import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import redisClient from '../../redis-client';
import { cacheKeyPrefix } from '../constants/cacheKeyPrefix';

const ONE_HOUR_IN_SEC = 60 * 60;
const FIVE_HOURS = ONE_HOUR_IN_SEC * 5;
const TENANT_LIST_CACHE_DURATION_SEC =
  process.env.NODE_ENV === 'development' ? 5 * 60 : 4 * ONE_HOUR_IN_SEC;
const TENANT_LIST_CACHE_DURATION_MS = 4 * ONE_HOUR_IN_SEC * 1000;
const TENANT_LIST_CACHE_KEY = `${cacheKeyPrefix}_TENANT_CONFIG_LIST`;

/**
 * This is the default slug that will be used if no tenant is found.
 */
export const DEFAULT_TENANT = 'ttc';

// In-memory cache with timestamp for the full tenant list
let tenantListCache: {
  data: Tenant[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

/**
 * Fetches the full tenant config list with caching
 * @returns Tenant[]
 */
export const getTenantConfigList = async (): Promise<Tenant[]> => {
  try {
    const currentTimestamp = Date.now();

    // Check in-memory cache first
    if (
      tenantListCache.data !== null &&
      currentTimestamp - tenantListCache.timestamp <
        TENANT_LIST_CACHE_DURATION_MS
    ) {
      console.log('Using in-memory cached tenant list');
      return tenantListCache.data;
    }

    // Then check Redis cache
    if (redisClient !== null) {
      const cachedTenants = await redisClient.get<Tenant[]>(
        TENANT_LIST_CACHE_KEY
      );
      if (cachedTenants) {
        console.log('Using Redis cached tenant list');
        // Update in-memory cache
        tenantListCache = {
          data: cachedTenants,
          timestamp: currentTimestamp,
        };
        return cachedTenants;
      }
    }

    // Fetch from API if not in any cache
    console.log('Fetching tenant list from API');
    const response = await fetch(
      `${process.env.API_ENDPOINT}/app/tenants?_scope=deployment`
    );
    // error handling for non-2xx status
    if (!response.ok) {
      console.error('Non-2xx status fetching tenant list:', response.status);
      throw new Error(`Failed to fetch tenant list: ${response.status}`);
    }
    const tenants = (await response.json()) as Tenant[];

    // Update Redis cache
    if (redisClient !== null) {
      await redisClient.set(TENANT_LIST_CACHE_KEY, JSON.stringify(tenants), {
        ex: TENANT_LIST_CACHE_DURATION_SEC,
      });
    }

    // Update in-memory cache
    tenantListCache = {
      data: tenants,
      timestamp: currentTimestamp,
    };

    return tenants;
  } catch (err) {
    console.error('Error in getTenantConfigList', err);

    // Use stale cache in case of error
    if (tenantListCache.data !== null) {
      console.log('Using stale tenant list cache due to API error');
      return tenantListCache.data;
    }

    return []; // Return empty array as fallback
  }
};

/**
 * Helper function to find a tenant by host
 */
function findTenantByHost(tenants: Tenant[], host: string): Tenant | undefined {
  return tenants.find((tenant) => {
    if (tenant.config.customDomain) {
      try {
        const urlObj = new URL(tenant.config.customDomain);
        return urlObj.host === host;
      } catch (e) {
        return false;
      }
    }

    if (tenant.config.appDomain) {
      try {
        const urlObj = new URL(tenant.config.appDomain);
        return urlObj.host === host;
      } catch (e) {
        return false;
      }
    }

    return false;
  });
}

/**
 * Returns the paths for `getStaticPaths` based on the subdomain of every
 * available hostname.
 */
export async function constructPathsForTenantSlug() {
  const tenants = await getTenantConfigList();

  if (process.env.IS_SINGLE_TENANT_SERVER === 'true') {
    // Return only the path for the specific Heroku tenant
    return [{ params: { slug: process.env.TENANT || DEFAULT_TENANT } }];
  }

  // build paths for each of the sites
  if (tenants) {
    return tenants
      .filter((tenant) => tenant.config.slug)
      .map((item) => {
        return { params: { slug: item.config.slug } };
      });
  }
}

/**
 * Return the tenant config based for a tenant
 * @param slug
 * @returns Tenant
 */
export const getTenantConfig = async (slug: string): Promise<Tenant> => {
  try {
    const caching_key = `${cacheKeyPrefix}_TENANT_CONFIG_${slug}`;

    // Check Redis cache first for this specific tenant
    if (redisClient !== null) {
      const tenant = await redisClient.get<Tenant>(caching_key);
      if (tenant) {
        return tenant;
      }
    }

    // Use the cached tenant list instead of fetching again
    const tenantConfList = await getTenantConfigList();

    const _tenantConf = tenantConfList.find(
      (item) => item.config.slug === slug
    );

    const defaultTenantConfig = tenantConfList.find(
      (item) => item.config.slug === DEFAULT_TENANT
    );

    const tenantConf = _tenantConf ?? defaultTenantConfig;

    // Cache in Redis
    if (redisClient !== null && tenantConf) {
      await redisClient.set(caching_key, JSON.stringify(tenantConf), {
        ex: FIVE_HOURS,
      });
    }

    return tenantConf as Tenant;
  } catch (err) {
    console.error('Error in getTenantConfig', err);
    throw err;
  }
};

/**
 * Returns the tenant slug from host
 */
export async function getTenantSlug(host: string): Promise<string> {
  const tenants = await getTenantConfigList();
  const tenant = findTenantByHost(tenants, host);

  return tenant?.config.slug ?? DEFAULT_TENANT;
}

/**
 * Returns tenant slug and supported languages with optimized caching
 */
export async function getTenantConciseInfo(host: string): Promise<{
  slug: string;
  supportedLanguages: string[];
}> {
  const tenants = await getTenantConfigList();

  // Find tenant by host
  const tenant =
    findTenantByHost(tenants, host) ||
    tenants.find((tenant) => tenant.config.slug === DEFAULT_TENANT);

  return {
    slug: tenant?.config.slug ?? DEFAULT_TENANT,
    supportedLanguages: Object.values(tenant?.config.languages ?? { 0: 'en' }),
  };
}

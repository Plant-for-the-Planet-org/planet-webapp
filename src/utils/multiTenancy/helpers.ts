import { Tenant } from '@planet-sdk/common/build/types/tenant';
import redisClient from '../../redis-client';

const ONE_HOUR_IN_SEC = 60 * 60;
const FIVE_HOURS = ONE_HOUR_IN_SEC * 5;

/**
 * This is the default slug that will be used if no tenant is found.
 */
export const DEFAULT_TENANT = 'planet';

/**
 *
 * Returns the tenant config list
 * @returns Tenant[]
 *
 */
export const getTenantConfigList = async () => {
  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/app/tenants?_scope=deployment`
    );
    const tenants = (await response.json()) as Tenant[];
    return tenants;
  } catch (err) {
    console.log('Error in getTenantConfigList', err);
  }
};

/**
 * Returns the paths for `getStaticPaths` based on the subdomain of every
 * available hostname.
 */
export async function constructPathsForTenantSlug() {
  const tenants = (await getTenantConfigList()) as Tenant[];

  // build paths for each of the sites
  return tenants
    .filter((tenant) => tenant.config.slug)
    .map((item) => {
      return { params: { slug: item.config.slug } };
    });
}

/**
 *
 * Return the tenant config based for a tenant
 *
 * @param slug
 * @returns Tenant
 */
export const getTenantConfig = async (slug: string): Promise<Tenant> => {
  try {
    const caching_key = `TENANT_CONFIG_${slug}`;

    const tenant = await redisClient.get<Tenant>(caching_key);

    if (tenant) {
      return tenant;
    }

    const tenantConfList = (await getTenantConfigList()) as Tenant[];

    const _tenantConf = tenantConfList.find(
      (item) => item.config.slug === slug
    );

    const defaultTenantConfig = tenantConfList.find(
      (item) => item.config.slug === DEFAULT_TENANT
    );

    const tenantConf = _tenantConf ?? defaultTenantConfig;

    await redisClient.set(caching_key, JSON.stringify(tenantConf), {
      ex: FIVE_HOURS,
    });

    return tenantConf as Tenant; // Ensure that the returned value is of type Tenant
  } catch (err) {
    console.log('Error in getTenantConfig', err);
    throw err; // Re-throw the error to propagate it
  }
};

/**
 * Returns the subdomain of the current hostname.
 */
export async function getTenantSlug(host: string) {
  const tenants = await getTenantConfigList();

  const tenant = tenants?.find((tenant) => {
    if (tenant.config.customDomain) {
      const urlObj = new URL(tenant.config.customDomain);
      return urlObj.host === host;
    } else {
      const urlObj = new URL(tenant.config.appDomain);
      return urlObj.host === host;
    }
  });

  console.log('tenant', tenant, host);

  return tenant?.config.slug ?? DEFAULT_TENANT;
}
import { Tenant, Tenants } from '@planet-sdk/common/build/types/tenant';
import { NextResponse } from 'next/server';
import redisClient from '../../redis-client';

const ONE_HOUR_IN_SEC = 60 * 60;
const FIVE_HOURS = ONE_HOUR_IN_SEC * 5;

/**
 * This is the default slug that will be used if no tenant is found.
 */
export const DEFAULT_TENANT = 'planet';
const DEFAULT_TENANT_DOMAIN = 'https://www1.plant-for-the-planet.org';

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
 * Returns the data of the hostname based on its subdomain.
 *
 * This method is used by pages under middleware.ts
 */
export async function getHostnameDataBySubdomain(subdomain: string) {
  const tenants = await getTenantConfigList();

  return tenants.find((item) => item.tenantName === subdomain);
}

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
 * Determines if the domain is a subdomain or not.
 */
function isSubdomain(domain: string) {
  const domainParts = domain.split('.');

  return process.env.NODE_ENV !== 'development'
    ? !domain.startsWith('www') &&
        !domain.startsWith('www1') &&
        domainParts.length > 2
    : domainParts.length > 1;
}

/**
 *
 * Return the tenant config based for a tenant
 *
 * @param slug
 * @returns Tenant
 */
export const getTenantConfig = async (slug: string) => {
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

    return tenantConf;
  } catch (err) {
    console.log('Error in getTenantConfig', err);
  }
};

/**
 * Returns the subdomain of the current hostname.
 */
export async function getTenantSubdomainOrRedirectObject(host: string) {
  // TODO - use cached api response
  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as Tenants;

  const rootDomain = host.includes(process.env.ROOT_DOMAIN!);

  let subdomain;

  if (!rootDomain) {
    const tenant = tenants.find((tenant) =>
      tenant.config.customDomain
        ? tenant.config.customDomain.includes(host)
        : tenant.config.appDomain.includes(host)
    );

    subdomain = tenant?.config.subDomain ?? DEFAULT_TENANT;
  } else {
    if (isSubdomain(host)) {
      subdomain = host.replace(`.${process.env.ROOT_DOMAIN}`, '');

      // Match it with the tenant Information
      const tenant = await getTenantConfig(subdomain);
      // TODO: Must be app domain not custom domain
      return NextResponse.redirect(
        tenant ? tenant.customDomain : DEFAULT_TENANT_DOMAIN,
        301
      );
    } else {
      subdomain = DEFAULT_TENANT;
    }
  }

  return subdomain;
}

/**
 * Returns the subdomain of the current hostname.
 */
export async function getTenantSlug(host: string) {
  const tenants = await getTenantConfigList();

  const tenant = tenants.find((tenant) =>
    tenant.config.customDomain
      ? tenant.config.customDomain.includes(host)
      : tenant.config.appDomain.includes(host)
  );

  return tenant?.config.slug ?? DEFAULT_TENANT;
}

import {
  TenantAppConfig,
  Tenants,
} from '@planet-sdk/common/build/types/tenant';
import { NextResponse } from 'next/server';
import redisClient from '../../redis-client';

const ONE_HOUR_IN_SEC = 60 * 60;
const TWO_HOURS = ONE_HOUR_IN_SEC * 2;

const caching_key = 'TENANT_CONFIG_LIST';

/**
 * This is the default subdomain that will be used if no subdomain is found.
 */
const DEFAULT_TENANT_SUBDOMAIN = 'planet';
const DEFAULT_TENANT_DOMAIN = 'https://www1.plant-for-the-planet.org';

/**
 *
 * Returns the tenant config list
 * @returns TenantAppConfig[]
 *
 */
export const getTenantConfigList = async (): Promise<TenantAppConfig[]> => {
  const cacheHit = await redisClient.get(caching_key);

  if (cacheHit) {
    return JSON.parse(cacheHit);
  }

  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as TenantAppConfig[];

  await redisClient.set(caching_key, JSON.stringify(tenants), {
    EX: TWO_HOURS,
  });

  return tenants;
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
export async function getSubdomainPaths() {
  const tenants = await getTenantConfigList();

  // get all sites that have subdomains set up
  const subdomains = tenants.filter((item) => item.tenantName);

  // build paths for each of the sites in the previous two lists
  return subdomains.map((item) => {
    return { params: { site: item.tenantName } };
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

    subdomain = tenant?.config.subDomain ?? DEFAULT_TENANT_SUBDOMAIN;
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
      subdomain = DEFAULT_TENANT_SUBDOMAIN;
    }
  }

  return subdomain;
}

export async function getTenantSlug(host: string) {
  // TODO - use cached api response
  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as Tenants;

  const tenant = tenants.find((tenant) =>
    tenant.config.customDomain
      ? tenant.config.customDomain.includes(host)
      : tenant.config.appDomain.includes(host)
  );

  return tenant?.config.subDomain ?? DEFAULT_TENANT_SUBDOMAIN;
}

/**
 *
 * Return the tenant config based for a tenant
 *
 * @param tenant
 * @returns TenantAppConfig
 */

export const getTenantConfig = async (tenant: string) => {
  const tenantConfList = await getTenantConfigList();

  const tenantConf = tenantConfList.find((item) => item.tenantName === tenant);

  return tenantConf;
};

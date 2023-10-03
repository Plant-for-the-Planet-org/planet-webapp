import {
  TenantAppConfig,
  Tenants,
} from '@planet-sdk/common/build/types/tenant';
import NodeCache from 'node-cache';

/**
 * This is the default subdomain that will be used if no subdomain is found.
 */
const DEFAULT_TENANT_SUBDOMAIN = 'planet';

/**
 * Returns the data of the hostname based on its subdomain.
 *
 * This method is used by pages under middleware.ts
 */
export async function getHostnameDataBySubdomain(subdomain: string) {
  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as Tenants;

  return tenants.find((item) => item.config.subDomain === subdomain);
}

/**
 * Returns the paths for `getStaticPaths` based on the subdomain of every
 * available hostname.
 */
export async function getSubdomainPaths() {
  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as Tenants;

  // get all sites that have subdomains set up
  const subdomains = tenants.filter((item) => item.config.subDomain);

  // build paths for each of the sites in the previous two lists
  return subdomains.map((item) => {
    return { params: { site: item.config.subDomain } };
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
export async function getTenantSubdomainOrDefault(
  localSubdomainOrTenantDomain: string
) {
  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as Tenants;

  const rootDomain = localSubdomainOrTenantDomain.includes(
    process.env.ROOT_DOMAIN!
  );

  let subdomain;

  if (!rootDomain) {
    const tenant = tenants.find((tenant) =>
      tenant.config.customDomain
        ? tenant.config.customDomain.includes(localSubdomainOrTenantDomain)
        : tenant.config.appDomain.includes(localSubdomainOrTenantDomain)
    );

    subdomain = tenant?.config.subDomain ?? DEFAULT_TENANT_SUBDOMAIN;
  } else {
    if (isSubdomain(localSubdomainOrTenantDomain)) {
      subdomain = localSubdomainOrTenantDomain.replace(
        `.${process.env.ROOT_DOMAIN}`,
        ''
      );
    } else {
      subdomain = DEFAULT_TENANT_SUBDOMAIN;
    }
  }

  return subdomain;
}

/**
 *
 * Return the tenant config based for a tenant 
 *
 * @param tenant
 * @returns TenantAppConfig
 */

const ONE_HOUR_IN_SEC = 60 * 60;
const TWO_HOURS = ONE_HOUR_IN_SEC * 2;

const cache = new NodeCache({ stdTTL: TWO_HOURS });
const key = 'TENANT_CONFIG';

export const getTenantConfig = async (tenant: string) => {
  const cacheHit = cache.get<TenantAppConfig[]>(key);

  if (cacheHit) {
    const tenantConf = cacheHit.find(
      (_tenant) => _tenant.tenantName === tenant
    )
    return tenantConf;
  }

  const response = await fetch(`${process.env.API_ENDPOINT}/app/tenants`);

  const tenants = (await response.json()) as TenantAppConfig[];

  cache.set(key, tenants)

  const tenantConf = tenants.find(
    (_tenant) => _tenant.tenantName === tenant
  );

  return tenantConf;
};

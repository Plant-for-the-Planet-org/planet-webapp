// If the API_ENDPOINT is https://app-staging.planet.com, the cachePrefix will be 'staging'
export const cacheKeyPrefix =
  process.env.API_ENDPOINT?.replace('https://', '').split('.')[0] ||
  'env_missing';

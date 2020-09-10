const scheme =
  process.env.SCHEME === 'http' || process.env.SCHEME === 'https'
    ? process.env.SCHEME
    : 'https';

module.exports = {
  // your config for other plugins or the general next.js here...
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    MAPBOXGL_ACCESS_TOKEN: process.env.MAPBOXGL_ACCESS_TOKEN,
    AUTH0_CUSTOM_DOMAIN: process.env.AUTH0_CUSTOM_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    VERCEL_URL: process.env.VERCEL_URL,
    TENANT: process.env.TENANT,
    TENANTID: process.env.TENANTID,
    API_ENDPOINT: scheme + '://' + process.env.API_ENDPOINT,
    CDN_URL: scheme + '://' + process.env.CDN_URL,
  },
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

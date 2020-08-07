module.exports = {
  // your config for other plugins or the general next.js here...
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    MAPBOXGL_ACCESS_TOKEN: process.env.MAPBOXGL_ACCESS_TOKEN,
    API_ENDPOINT: process.env.API_ENDPOINT,
    AUTH0_CUSTOM_DOMAIN: process.env.AUTH0_CUSTOM_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    VERCEL_URL: process.env.VERCEL_URL,
  },
  trailingSlash: true,
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

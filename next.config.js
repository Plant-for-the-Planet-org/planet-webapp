module.exports = {
  // your config for other plugins or the general next.js here...
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    MAPBOXGL_ACCESS_TOKEN: process.env.MAPBOXGL_ACCESS_TOKEN,
    API_ENDPOINT: process.env.API_ENDPOINT,
    CDN_URL: process.env.CDN_URL,
    TENANT: process.env.TENANT,
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

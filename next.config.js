module.exports = {
  // your config for other plugins or the general next.js here...
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    MAPBOXGL_ACCESS_TOKEN: process.env.MAPBOXGL_ACCESS_TOKEN,
    TENANT: process.env.TENANT,
    TENANTID: process.env.TENANTID,
    SCHEME: process.env.SCHEME,
    API_ENDPOINT: process.env.SCHEME+"://"+process.env.API_ENDPOINT,
    CDN_URL: process.env.SCHEME+"://"+process.env.CDN_URL,
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

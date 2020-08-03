module.exports = {
  // your config for other plugins or the general next.js here...
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    API_ENDPOINT: 'https://app-development.plant-for-the-planet.org',
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_ENDPOINT: 'https://app-development.plant-for-the-planet.org',
  },
  env: {
    MAPBOXGL_ACCESS_TOKEN: process.env.MAPBOXGL_ACCESS_TOKEN,
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

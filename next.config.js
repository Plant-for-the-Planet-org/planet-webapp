const fs = require('fs');
const path = require('path');
const { PHASE_PRODUCTION_BUILD } = require('next/constants');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { withSentryConfig } = require('@sentry/nextjs/config');

// MapLibre v6 loads its worker from public/, put there by scripts/copy-maplibre-worker.js via the postinstall and prebuild hooks.
// If those files are missing every map renders blank and reports nothing, so fail the build rather than ship it.
// This check lives here because next.config.js is read inside `next build`, so it still fires if the npm scripts are bypassed.
const assertMaplibreWorkerCopied = () => {
  const missing = [
    'maplibre-gl-worker.mjs',
    'maplibre-gl-shared.mjs',
  ].filter((file) => !fs.existsSync(path.join(__dirname, 'public', file)));

  if (missing.length) {
    throw new Error(
      `Missing MapLibre worker files in public/: ${missing.join(', ')}. ` +
        'Run `npm run build` rather than `next build`, or run `npm run copy-maplibre-worker` directly. ' +
        'Without these files every map renders blank with no error.'
    );
  }
};

const { SITE_IMAGERY_API_URL } = process.env;

const basePath = '';

const scheme =
  process.env.SCHEME === 'http' || process.env.SCHEME === 'https'
    ? process.env.SCHEME
    : 'https';

const nextauthUrl = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}`
  : `${scheme}://${process.env.VERCEL_URL}`;

const hasAssetPrefix =
  process.env.ASSET_PREFIX !== '' && process.env.ASSET_PREFIX !== undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    // for webpack4 - needs "next": "10.2.0" due to error solved in webpack5
    //config.node = {
    //  fs: 'empty',
    //}
    // for webpack5:
    config.resolve.fallback = {
      fs: false,
      path: require.resolve('path-browserify'),
    };
    return config;
  },
  basePath,
  // your config for other plugins or the general next.js here...
  env: {
    AUTH0_CUSTOM_DOMAIN: process.env.AUTH0_CUSTOM_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    TENANT: process.env.TENANT,
    TENANTID: process.env.TENANTID,
    SCHEME: scheme,
    API_ENDPOINT: `${scheme}://${process.env.API_ENDPOINT}`,
    CDN_URL: `${scheme}://${process.env.CDN_URL}`,
    NEXTAUTH_URL: nextauthUrl,
    VERCEL_URL: process.env.VERCEL_URL,
    SITE_IMAGERY_API_URL: SITE_IMAGERY_API_URL,
    WIDGET_URL: process.env.WIDGET_URL,
    CONFIG_URL: process.env.CONFIG_URL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    WEBHOOK_URL: process.env.WEBHOOK_URL,
    LAYERS_API_KEY: process.env.LAYERS_API_KEY,
    LAYERS_API_ENDPOINT: process.env.LAYERS_API_ENDPOINT,
    ENABLE_EXPLORE: process.env.ENABLE_EXPLORE,
    TREEMAPPER_URL: process.env.TREEMAPPER_URL,
  },
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  // Sentry's module hook must patch Node's require() at runtime, so it cannot be bundled.
  // Next currently externalises it anyway; this makes that explicit rather than relying on a default.
  serverExternalPackages: ['import-in-the-middle', 'require-in-the-middle'],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/my-trees',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/redeem',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/yucatan-reforestation',
        destination: '/yucatan',
        permanent: true,
      },
      {
        source: '/tagdesbaumes',
        destination: 'https://www.plant-for-the-planet.org/de/tagdesbaumes/',
        permanent: true,
      },
      {
        source: '/:locale/tagdesbaumes',
        destination: 'https://www.plant-for-the-planet.org/de/tagdesbaumes/',
        permanent: true,
      },
      {
        source: '/:locale/profile/register-trees',
        destination: '/:locale/profile',
        permanent: true,
      },
      {
        source: '/:locale/profile/treemapper',
        destination: '/:locale/treemapper?source=plant-locations',
        permanent: false,
      },
      {
        source: '/:locale/profile/treemapper/data-explorer',
        destination: '/:locale/treemapper?source=data-explorer',
        permanent: false,
      },
      {
        source: '/:locale/profile/treemapper/my-species',
        destination: '/:locale/treemapper?source=my-species',
        permanent: false,
      },
      {
        source: '/:locale/profile/treemapper/import',
        destination: '/:locale/treemapper?source=import',
        permanent: false,
      },
    ];
  },
  assetPrefix: hasAssetPrefix
    ? `${scheme}://${process.env.ASSET_PREFIX}`
    : undefined,
  // Asset Prefix allows to use CDN for the generated js files
  // https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
};

module.exports = (phase) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    assertMaplibreWorkerCopied();
  }

  const plugins = [withBundleAnalyzer];
  const config = plugins.reduce((config, plugin) => plugin(config), nextConfig);
  return withSentryConfig(config, {
    // org, project and authToken are read from the SENTRY_ORG, SENTRY_PROJECT and SENTRY_AUTH_TOKEN env vars by default.
    widenClientFileUpload: true,
    // This app uses the Pages Router only, so there's no App Router navigation to instrument.
    suppressOnRouterTransitionStartWarning: true,
  });
};

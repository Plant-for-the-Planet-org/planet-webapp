const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Use the SentryWebpack plugin to upload the source maps during build step
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  VERCEL_GIT_COMMIT_SHA,
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITLAB_COMMIT_SHA,
  VERCEL_BITBUCKET_COMMIT_SHA,
  SOURCE_VERSION,
  COMMIT_REF,
  SITE_IMAGERY_API_URL,
  DB_CONN_URL,
} = process.env;

// allow source map uploads from Vercel, Heroku and Netlify deployments
const COMMIT_SHA =
  VERCEL_GIT_COMMIT_SHA ||
  VERCEL_GITHUB_COMMIT_SHA ||
  VERCEL_GITLAB_COMMIT_SHA ||
  VERCEL_BITBUCKET_COMMIT_SHA ||
  SOURCE_VERSION ||
  COMMIT_REF;

process.env.SENTRY_DSN = SENTRY_DSN;
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
  serverRuntimeConfig: {
    rootDir: __dirname,
  },
  webpack: (config, options) => {
    // In `pages/_app.js`, Sentry is imported from @sentry/browser. While
    // @sentry/node will run in a Node.js environment. @sentry/node will use
    // Node.js-only APIs to catch even more unhandled exceptions.
    //
    // This works well when Next.js is SSRing your page on a server with
    // Node.js, but it is not what we want when your client-side bundle is being
    // executed by a browser.
    //
    // Luckily, Next.js will call this webpack function twice, once for the
    // server and once for the client. Read more:
    // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
    //
    // So ask Webpack to replace @sentry/node imports with @sentry/browser when
    // building the browser's bundle
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }
    // for webpack4 - needs "next": "10.2.0" due to error solved in webpack5
    //config.node = {
    //  fs: 'empty',
    //}
    // for webpack5:
    config.resolve.fallback = {
      fs: false,
      path: require.resolve('path-browserify'),
    };

    // When all the Sentry configuration env variables are available/configured
    // The Sentry webpack plugin gets pushed to the webpack plugins to build
    // and upload the source maps to sentry.
    // This is an alternative to manually uploading the source maps
    // Note: This is disabled in development mode.
    if (
      SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
      SENTRY_AUTH_TOKEN &&
      COMMIT_SHA &&
      NODE_ENV === 'production'
    ) {
      config.plugins.push(
        sentryWebpackPlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
          // deprecated parameters from older version
          //include: '.next',
          //ignore: ['node_modules'],
          //stripPrefix: ['webpack://_N_E/'],
          //urlPrefix: `~${basePath}/_next`,
          //release: COMMIT_SHA,
        })
      );
    }
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
    ENABLE_ANALYTICS: DB_CONN_URL ? 'true' : 'false',
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    WEBHOOK_URL: process.env.WEBHOOK_URL,
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
    ];
  },
  assetPrefix: hasAssetPrefix
    ? `${scheme}://${process.env.ASSET_PREFIX}`
    : undefined,
  // Asset Prefix allows to use CDN for the generated js files
  // https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
};

module.exports = () => {
  const plugins = [withBundleAnalyzer];
  return plugins.reduce((config, plugin) => plugin(config), nextConfig);
};

const withPlugins = require('next-compose-plugins');
// Use the hidden-source-map option when you don't want the source maps to be
// publicly available on the servers, only to the error reporting
const withSourceMaps = require('@zeit/next-source-maps')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITLAB_COMMIT_SHA,
  VERCEL_BITBUCKET_COMMIT_SHA,
  SOURCE_VERSION,
} = process.env;

const COMMIT_SHA =
  VERCEL_GITHUB_COMMIT_SHA ||
  VERCEL_GITLAB_COMMIT_SHA ||
  VERCEL_BITBUCKET_COMMIT_SHA ||
  SOURCE_VERSION;

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

module.exports = withPlugins(
  [
    [withBundleAnalyzer],
    [withSourceMaps],
  ],
  {
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
      config.node = {
        fs: 'empty',
      };

      config.node = {
        fs: 'empty',
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
          new SentryWebpackPlugin({
            include: '.next',
            ignore: ['node_modules'],
            stripPrefix: ['webpack://_N_E/'],
            urlPrefix: `~${basePath}/_next`,
            release: COMMIT_SHA,
          }),
          new SentryWebpackPlugin({
            include: '.next',
            ignore: ['node_modules'],
            stripPrefix: ['webpack://_N_E/'],
            urlPrefix: `~${basePath}/_next`,
            release: COMMIT_SHA,
          })
        );
      }
      return config;
    },
    basePath,
    // your config for other plugins or the general next.js here...
    devIndicators: {
      autoPrerender: false,
    },
    env: {
      MAPBOXGL_ACCESS_TOKEN: process.env.MAPBOXGL_ACCESS_TOKEN,
      AUTH0_CUSTOM_DOMAIN: process.env.AUTH0_CUSTOM_DOMAIN,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      TENANT: process.env.TENANT,
      TENANTID: process.env.TENANTID,
      SCHEME: scheme,
      API_ENDPOINT: `${scheme}://${process.env.API_ENDPOINT}`,
      CDN_URL: `${scheme}://${process.env.CDN_URL}`,
      NEXTAUTH_URL: nextauthUrl,
      VERCEL_URL: process.env.VERCEL_URL
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
          source: '/account-activate/:slug*',
          destination: '/open-app',
          permanent: true,
        },
        {
          source: '/competition/:slug*',
          destination: '/open-app',
          permanent: true,
        },
        {
          source: '/donate-tree',
          destination: '/open-app',
          permanent: true,
        },
        {
          source: '/donate-trees',
          destination: '/open-app',
          permanent: true,
        },
        {
          source: '/donate-trees/:slug*',
          destination: '/open-app',
          permanent: true,
        },
        {
          source: '/my-trees',
          destination: '/login',
          permanent: true,
        },
        {
          source: '/project/:slug*',
          destination: '/open-app',
          permanent: true,
        },
        {
          source: '/redeem',
          destination: '/login',
          permanent: true,
        },
        {
          source: '/reset-password/:slug*',
          destination: '/open-app',
          permanent: true,
        },
        {
          source: '/signup',
          destination: '/open-app',
          permanent: true,
        },
        {
          source: '/signup/:slug*',
          destination: '/open-app',
          permanent: true,
        },
      ];
    },
    assetPrefix: hasAssetPrefix ? `${scheme}://${process.env.ASSET_PREFIX}` : '',
    // Asset Prefix allows to use CDN for the generated js files
    // https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
  },
);

import CssBaseline from '@material-ui/core/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import InitialLoader from '../src/features/common/ContentLoaders/InitialLoader';
import '../src/features/public/Donations/styles/Maps.scss';
import '../src/theme/global.scss';
import ThemeProvider from '../src/utils/themeContext';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const config = getConfig();
  const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    integrations: [
      new RewriteFrames({
        iteratee: (frame) => {
          frame.filename = frame.filename.replace(distDir, 'app:///_next');
          return frame;
        },
      }),
    ],
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
}

export default function PlanetWeb({ Component, pageProps, err }: any) {
  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  };

  React.useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles!.parentElement!.removeChild(jssStyles);
    }
  }, []);

  const [configAdded, setConfigAdded] = React.useState(false);

  React.useEffect(() => {
    async function loadConfig() {
      await fetch(`${process.env.API_ENDPOINT}/public/v1.2/en/config`, {
        headers: { 'tenant-key': `${process.env.TENANTID}` },
      }).then(async (res) => {
        const config = await res.json();
        localStorage.setItem('config', JSON.stringify(config));
        localStorage.setItem('countryCode', config.country);
        localStorage.setItem('currencyCode', config.currency);
        setConfigAdded(true);
      });
    }
    loadConfig();
  }, []);

  return configAdded ? (
    <ThemeProvider  err={err}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  ) : (
    <InitialLoader />
  );
}

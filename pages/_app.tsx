import CssBaseline from '@material-ui/core/CssBaseline';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import '../src/features/public/Donations/styles/Maps.scss';
import '../src/theme/global.scss';
import ThemeProvider from '../src/utils/themeContext';
import i18next from '../i18n';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import getsessionId from '../src/utils/getSessionId';

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
  // const { useTranslation } = i18next;
  // const { i18n } = useTranslation();

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  };

  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    i18next.initPromise.then(() => setInitialized(true));
  }, []);

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

  React.useEffect(() => {
    async function loadConfig() {
      await fetch(`${process.env.API_ENDPOINT}/public/v1.2/en/config`, {
        headers: { 'tenant-key': `${process.env.TENANTID}`, 'X-SESSION-ID': await getsessionId()  },
      })
        .then(async (res) => {
          const config = await res.json();
          localStorage.setItem('config', JSON.stringify(config));
          if (localStorage.getItem('countryCode') === null) {
            localStorage.setItem('countryCode', config.country);
          }
          if (localStorage.getItem('currencyCode') === null) {
            localStorage.setItem('currencyCode', config.currency);
          }
        })
        .catch((err) => console.log(`Something went wrong: ${err}`));
    }
    loadConfig();
  }, []);

  // Norbert: language gets detected by i18next-browser-languagedetector
  // React.useEffect(() => {
  //   if (localStorage.getItem('language') !== null) {
  //     i18n.changeLanguage(localStorage.getItem('language'));
  //   } else {
  //     i18n.changeLanguage('en');
  //   }
  // }, []);

  return (
    <ThemeProvider>
      <CssBaseline />
      <Component i18nloaded={initialized} {...pageProps} />
    </ThemeProvider>
  );
}

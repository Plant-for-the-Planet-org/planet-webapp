import CssBaseline from '@material-ui/core/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';
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
  const { Trans, useTranslation } = i18next;
  const { i18n } = useTranslation();
  const [language, setLanguage] = React.useState('en');

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
        headers: { 'tenant-key': `${process.env.TENANTID}` },
      }).then(async (res) => {
        const config = await res.json();
        localStorage.setItem('config', JSON.stringify(config));
        localStorage.setItem('countryCode', config.country);
        localStorage.setItem('currencyCode', config.currency);
      });
    }
    loadConfig();
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem('language') !== null) {
      console.log('localstorage', localStorage.getItem('language'));
      i18n.changeLanguage(localStorage.getItem('language'));
    } else {
      i18n.changeLanguage(language);
    }
  }, [language]);

  if (!initialized) {
    return <p>Loading...</p>;
  } else {
    return (
      <ThemeProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

import CssBaseline from '@material-ui/core/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import '../src/features/public/Donations/styles/Maps.scss';
import '../src/theme/global.scss';
import ThemeProvider from '../src/utils/themeContext';
import i18next from '../i18n';

export default function PlanetWeb({ Component, pageProps }: any) {
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
      await fetch(
        `${process.env.API_ENDPOINT}/public/v1.2/en/config`,
        {
          headers: { 'tenant-key': `${process.env.TENANTID}` },
        },
      ).then(async (res) => {
        const config = await res.json();
        localStorage.setItem('config', JSON.stringify(config));
        localStorage.setItem('countryCode', config.country);
        localStorage.setItem('currencyCode', config.currency);
      });
    }
    loadConfig();
  }, []);

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

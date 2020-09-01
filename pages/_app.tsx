import CssBaseline from '@material-ui/core/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import '../src/features/public/Donations/styles/Maps.scss';
import '../src/theme/global.scss';
import ThemeProvider from '../src/utils/themeContext';

export default function PlanetWeb({ Component, pageProps }: any) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles!.parentElement!.removeChild(jssStyles);
    }
  }, []);

  React.useEffect(() => {
    async function loadConfig() {

      const res = await fetch(`${process.env.API_ENDPOINT}/public/v1.2/en/config`, {
        headers: { 'tenant-key': `${process.env.TENANTID}` }
      })
        .then(async (res) => {
          const config = await res.json();
          localStorage.setItem('config', JSON.stringify(config));
          localStorage.setItem('countryCode', config.country);
          localStorage.setItem('currencyCode', config.currency);
        });

    }
    loadConfig();
  }, []);

  return (
    <ThemeProvider>
      <CssBaseline />

      <Component {...pageProps} />
    </ThemeProvider>
  );
}

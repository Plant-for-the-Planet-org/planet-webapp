import CssBaseline from '@material-ui/core/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import '../src/features/public/Donations/styles/Maps.scss';
import '../src/theme/global.scss';
import { initGA, logPageView } from '../src/utils/googleAnalytics';
import ThemeProvider from '../src/utils/themeContext';

export default function PlanetWeb({ Component, pageProps, config }: any) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles!.parentElement!.removeChild(jssStyles);
    }
  }, []);

  React.useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }, []);

  React.useEffect(() => {
    localStorage.setItem('config', JSON.stringify(config));
    localStorage.setItem('countryCode', config.country);
    localStorage.setItem('currencyCode', config.currency);
  }, [config]);

  return (
    <ThemeProvider>
      <CssBaseline />

      <Component {...pageProps} />
    </ThemeProvider>
  );
}
PlanetWeb.getInitialProps = async () => {
  const res = await fetch(`${process.env.API_ENDPOINT}/public/v1.2/en/config`);
  const config = await res.json();
  return { config: config };
};

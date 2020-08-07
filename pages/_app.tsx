import CssBaseline from '@material-ui/core/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Provider } from 'next-auth/client';
import React from 'react';
import '../src/features/public/Donations/styles/Maps.css';
import ThemeProvider from '../src/utils/themeContext';

function PlanetWeb({ Component, pageProps, config }: any) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles!.parentElement!.removeChild(jssStyles);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('config', JSON.stringify(config));
    localStorage.setItem('countryCode', config.country);
    localStorage.setItem('currencyCode', config.currency);
  }, [config]);

  let storedConfig;
  if (typeof Storage !== 'undefined') {
    storedConfig = localStorage.getItem('config');
  }

  return (
    <Provider session={pageProps.session}>
      <ThemeProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}
PlanetWeb.getInitialProps = async () => {
  const res = await fetch(`${process.env.API_ENDPOINT}/public/v1.2/en/config`);
  const config = await res.json();

  return { config: config, pageProps: {} };
};
export default PlanetWeb;

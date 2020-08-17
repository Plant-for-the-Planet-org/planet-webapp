import CssBaseline from '@material-ui/core/CssBaseline';
import { Elements } from '@stripe/react-stripe-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import '../src/features/public/Donations/styles/Maps.scss';
import ThemeProvider from '../src/utils/themeContext';
import { loadStripe } from '@stripe/stripe-js';

export default function PlanetWeb({ Component, pageProps, config }: any) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

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

  return (
    <ThemeProvider>
      <CssBaseline />
      <Elements stripe={stripePromise}>
        <Component {...pageProps} />
      </Elements>
    </ThemeProvider>
  );
}
PlanetWeb.getInitialProps = async () => {
  const res = await fetch(`${process.env.API_ENDPOINT}/public/v1.2/en/config`);
  const config = await res.json();
  return { config: config };
};

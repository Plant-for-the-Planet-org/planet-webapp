import CssBaseline from '@material-ui/core/CssBaseline';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import { Provider as AuthProvider } from 'next-auth/client';
import '../src/features/projects/styles/MapPopup.scss';
import '../src/theme/global.scss';
import './../src/features/projects/styles/Projects.scss';
import ThemeProvider from '../src/theme/themeContext';
import i18next from '../i18n';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import Layout from '../src/features/common/Layout';
import MapLayout from '../src/features/projects/components/MapboxMap';
import { useRouter } from 'next/router';
import { storeConfig } from '../src/utils/storeConfig';
import currencyContext from '../src/utils/Context/CurrencyContext';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const config = getConfig();
  const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    integrations: [
      new RewriteFrames({
        iteratee: (frame) => {
          frame.filename = frame.filename?.replace(distDir, 'app:///_next');
          return frame;
        },
      }),
    ],
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
}

export default function PlanetWeb({ Component, pageProps, err }: any) {
  const router = useRouter();
  const [currency, setCurrency] = React.useState('EUR');
  const [projects, setProjects] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [showProjects, setShowProjects] = React.useState(true);
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [isMap, setIsMap] = React.useState(false);
  const [searchedProject, setsearchedProjects] = React.useState([]);

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  };

  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    storeConfig();
  }, []);
  React.useEffect(() => {
    i18next.initPromise.then(() => setInitialized(true));
  }, []);

  React.useEffect(() => {
    if (router.pathname === '/' || router.pathname === '/[p]') {
      setIsMap(true);
    } else {
      setIsMap(false);
    }
  }, [router]);

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
      TagManager.initialize(tagManagerArgs);
    }
  }, []);

  React.useEffect(() => {
    const storedCurrency = getStoredCurrency();
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  const ProjectProps = {
    projects,
    project,
    setProject,
    setProjects,
    showSingleProject,
    setShowSingleProject,
    pageProps,
    initialized,
    showProjects,
    setShowProjects,
    searchedProject,
    setsearchedProjects,
  };

  return (
    <AuthProvider session={pageProps.session}>
      <ThemeProvider>
        <currencyContext.Provider value={{ currency, setCurrency }}>
          <CssBaseline />
          <Layout>
            {isMap ? (
              project ? (
                <MapLayout
                  {...ProjectProps}
                  mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
                />
              ) : projects ? (
                <MapLayout
                  {...ProjectProps}
                  mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
                />
              ) : null
            ) : null}
            <Component {...ProjectProps} />
          </Layout>
        </currencyContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}

import CssBaseline from '@material-ui/core/CssBaseline';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import { Provider as AuthProvider } from 'next-auth/client';
import '../src/features/projects/styles/MapPopup.scss';
import '../src/theme/global.scss';
import '../src/features/projects/styles/Projects.scss';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import ThemeProvider from '../src/theme/themeContext';
import i18next from '../i18n';
import Layout from '../src/features/common/Layout';
import MapLayout from '../src/features/projects/components/MapboxMap';
import storeConfig from '../src/utils/storeConfig';
import NetworkFailure from '../src/features/common/ErrorComponents/NetworkFailure';

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
  const [projects, setProjects] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [showProjects, setShowProjects] = React.useState(true);
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [isMap, setIsMap] = React.useState(false);
  const [searchedProject, setsearchedProjects] = React.useState([]);
  const [network, setNetwork] = React.useState(false);

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  };

  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    // storeConfig().catch((err) => {
    //   console.log(err, 'component');
    //   setNetwork(true);
    // });
    getStoreConfig();
  }, []);
  const getStoreConfig = () => {
    storeConfig().then(() => {
      setNetwork(false);
    })
      .catch((err) => {
        setNetwork(true);
      });
  };
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

  const handleNetwork = () => {
    setNetwork(!network)
  }

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
        {network && (
          <div
            style={{ position: 'fixed', bottom: 0, left: 0 }}
          >
            <NetworkFailure refresh={getStoreConfig} handleNetwork={handleNetwork} />
          </div>
        )}
        <Component {...ProjectProps} />
      </Layout>
    </ThemeProvider>
    </AuthProvider>
  );
}

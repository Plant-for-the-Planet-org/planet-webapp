import CssBaseline from '@material-ui/core/CssBaseline';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import '../src/features/public/Donations/styles/Maps.scss';
import '../src/theme/global.scss';
import ThemeProvider from '../src/theme/themeContext';
import i18next from '../i18n';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import Layout from '../src/features/common/Layout';
import MapLayout from '../src/features/public/Donations/components/MapboxMap';
import { useRouter } from 'next/router';

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
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [isMap, setIsMap] = React.useState(false);
  const [searchedProject, setsearchedProjects] = React.useState([]);

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  };

  const [initialized, setInitialized] = React.useState(false);

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
    if (
      process.env.NEXT_PUBLIC_GA_TRACKING_ID &&
      (process.env.NEXT_PUBLIC_GA_TRACKING_ID !== undefined ||
        process.env.NEXT_PUBLIC_GA_TRACKING_ID !== '' ||
        process.env.NEXT_PUBLIC_GA_TRACKING_ID !== null)
    ) {
      TagManager.initialize(tagManagerArgs);
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
    searchedProject,
    setsearchedProjects,
  };

  return (
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
        <Component {...ProjectProps} />
      </Layout>
    </ThemeProvider>
  );
}

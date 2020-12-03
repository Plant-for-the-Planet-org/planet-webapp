import CssBaseline from '@material-ui/core/CssBaseline';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import Router from 'next/router';
import { Auth0Provider } from '@auth0/auth0-react';
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

const onRedirectCallback = (appState) => {
  // Use Next.js's Router.replace method to replace the url
  Router.replace(appState?.returnTo || '/');
};

export default function PlanetWeb({ Component, pageProps, err }: any) {
  const router = useRouter();
  const [projects, setProjects] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [showProjects, setShowProjects] = React.useState(true);
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [isMap, setIsMap] = React.useState(false);
  const [searchedProject, setsearchedProjects] = React.useState([]);

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  };


  if (process.env.VERCEL_URL && typeof window !== 'undefined') {
    if (process.env.VERCEL_URL !== window.location.hostname) {      
      router.replace(process.env.VERCEL_URL);
    }
  }
  

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
    <Auth0Provider
      domain={process.env.AUTH0_CUSTOM_DOMAIN}
      clientId={process.env.AUTH0_CLIENT_ID}
      redirectUri={process.env.NEXTAUTH_URL}
      cacheLocation={"localstorage"}
      onRedirectCallback={onRedirectCallback}
    >
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
    </Auth0Provider>
  );
}

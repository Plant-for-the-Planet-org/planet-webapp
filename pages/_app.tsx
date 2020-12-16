import CssBaseline from '@material-ui/core/CssBaseline';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import TagManager from 'react-gtm-module';
import Router from 'next/router';
import { Auth0Provider } from '@auth0/auth0-react';
import '../src/features/projects/styles/MapPopup.scss';
import '../src/theme/global.scss';
import './../src/features/projects/styles/Projects.scss';
import './../src/features/common/Layout/Navbar/Navbar.scss';
import ThemeProvider from '../src/theme/themeContext';
import i18next from '../i18n';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import Layout from '../src/features/common/Layout';
import MapLayout from '../src/features/projects/components/MapboxMap';
import { useRouter } from 'next/router';
import { storeConfig } from '../src/utils/storeConfig';
import { Modal } from '@material-ui/core';
import ExploreInfoModal from '../src/features/projects/components/maps/ExploreInfoModal';
import CancelIcon from '../public/assets/images/icons/CancelIcon';
import tenantConfig from '../tenant.config';

const tenantConfiguration = tenantConfig();

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
      router.replace(`https://${process.env.VERCEL_URL}`);      
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

  const [openModal, setModalOpen] = React.useState(true);

  const PlanetModal =()=> {
    return(
      <div style={{
        backgroundColor:'white',
        minHeight:'300px',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        padding:'30px',
        borderRadius:'10px',
        width:'320px',
        position:'relative',
        flexDirection:'column',
        
      }}>
        <h2 style={{fontWeight:'bold'}}>Title</h2>
        <p style={{margin:'16px auto'}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <a target="_blank" style={{fontWeight:'bold'}} rel="noopener noreferrer" href={"http://blog.plant-for-the-planet.org/"}>
          Read Blog {'>'}
        </a>
        <div onClick={()=>setModalOpen(false)} style={{position:'absolute',right:'18px',top:'18px',cursor:'pointer'}}>
          <CancelIcon width={'20px'} />
        </div>

      </div>
    )
  }
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
          {tenantConfiguration.tenantName === 'planet' && (
            <Modal
              style={{
                display:'flex',
                height:'100%',
                width:'100%',
                justifyContent:'center',
                alignItems:'center'
              }}
              open={openModal}
              onClose={()=>setModalOpen(false)}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <PlanetModal/>
            </Modal>
          ) }
        
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

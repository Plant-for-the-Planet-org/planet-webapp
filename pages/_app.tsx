import CssBaseline from '@mui/material/CssBaseline';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import React, { useContext } from 'react';
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
import MapLayout from '../src/features/projects/components/ProjectsMap';
import { useRouter } from 'next/router';
import { storeConfig } from '../src/utils/storeConfig';
import tenantConfig from '../tenant.config';
import { browserNotCompatible } from '../src/utils/browsercheck';
import BrowserNotSupported from '../src/features/common/ErrorComponents/BrowserNotSupported';
import ProjectPropsProvider, {
  ProjectPropsContext,
} from '../src/features/common/Layout/ProjectPropsContext';
import UserPropsProvider from '../src/features/common/Layout/UserPropsContext';
import PlayButton from '../src/features/common/LandingVideo/PlayButton';
import ErrorHandlingProvider from '../src/features/common/Layout/ErrorHandlingContext';
import dynamic from 'next/dynamic';
import { BulkCodeProvider } from '../src/features/common/Layout/BulkCodeContext';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import materialTheme from '../src/theme/themeStyles';
<<<<<<< HEAD
import TenantContextProvider, {
  TenantContext,
} from '../src/features/common/Layout/TenantContext';
=======
import QueryParamsProvider from '../src/features/common/Layout/QueryParamsContext';
>>>>>>> develop

const VideoContainer = dynamic(
  () => import('../src/features/common/LandingVideo'),
  {
    ssr: false,
  }
);

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
    // from https://gist.github.com/pioug/b006c983538538066ea871d299d8e8bc,
    // also see https://docs.sentry.io/platforms/javascript/configuration/filtering/#decluttering-sentry
    ignoreErrors: [
      /^No error$/,
      /__show__deepen/,
      /_avast_submit/,
      /Access is denied/,
      /anonymous function: captureException/,
      /Blocked a frame with origin/,
      /console is not defined/,
      /cordova/,
      /DataCloneError/,
      /Error: AccessDeny/,
      /event is not defined/,
      /feedConf/,
      /ibFindAllVideos/,
      /myGloFrameList/,
      /SecurityError/,
      /MyIPhoneApp/,
      /snapchat.com/,
      /vid_mate_check is not defined/,
      /win\.document\.body/,
      /window\._sharedData\.entry_data/,
      /ztePageScrollModule/,
    ],
    denyUrls: [],
  });
}

const onRedirectCallback = (appState: any) => {
  // Use Next.js's Router.replace method to replace the url
  if (appState) Router.replace(appState?.returnTo || '/');
};

export default function PlanetWeb({ Component, pageProps, err }: any) {
  const { tenantID } = useContext(TenantContext);
  const router = useRouter();
  const [isMap, setIsMap] = React.useState(false);
  const [currencyCode, setCurrencyCode] = React.useState('');
  const [browserCompatible, setBrowserCompatible] = React.useState(false);

  const config = tenantConfig();

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
    storeConfig(tenantID);
  }, []);
  React.useEffect(() => {
    i18next.initPromise.then(() => setInitialized(true));
  }, []);

  React.useEffect(() => {
    if (
      router.pathname === '/' ||
      router.pathname === '/[p]' ||
      router.pathname === '/[p]/[id]'
    ) {
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
    setBrowserCompatible(browserNotCompatible());
  }, []);

  const ProjectProps = {
    pageProps,
    initialized,
    currencyCode,
    setCurrencyCode,
  };

  const [showVideo, setshowVideo] = React.useState(true);

  // if localShowVideo is undefined
  // set localShowVideo is true and show the video
  // if localShowVideo is true show the video
  // if localShowVideo is false hide the video

  const [localShowVideo, setLocalShowVideo] = React.useState(false);

  React.useEffect(() => {
    if (router.pathname === '/') {
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('showVideo')) {
          if (localStorage.getItem('showVideo') === 'true') {
            setLocalShowVideo(true);
          } else {
            setLocalShowVideo(false);
          }
        } else {
          localStorage.setItem('showVideo', 'true');
          setLocalShowVideo(true);
        }
      }
    } else {
      setLocalShowVideo(false);
    }
  }, []);

  React.useEffect(() => {
    setshowVideo(localShowVideo);
  }, [localShowVideo]);

  const { project, projects } = React.useContext(ProjectPropsContext);

  if (browserCompatible) {
    return <BrowserNotSupported />;
  } else {
    return (
      <ErrorHandlingProvider>
        <div>
          <div
            style={
              showVideo &&
              (config.tenantName === 'planet' || config.tenantName === 'ttc')
                ? {}
                : { display: 'none' }
            }
          >
            {config.tenantName === 'planet' || config.tenantName === 'ttc' ? (
              <VideoContainer setshowVideo={setshowVideo} />
            ) : (
              <></>
            )}
          </div>

          <div
            style={
              showVideo &&
              (config.tenantName === 'planet' || config.tenantName === 'ttc')
                ? { display: 'none' }
                : {}
            }
          >
            <Auth0Provider
              domain={process.env.AUTH0_CUSTOM_DOMAIN}
              clientId={process.env.AUTH0_CLIENT_ID}
              redirectUri={process.env.NEXTAUTH_URL}
              audience={'urn:plant-for-the-planet'}
              cacheLocation={'localstorage'}
              onRedirectCallback={onRedirectCallback}
              useRefreshTokens={true}
            >
              <ThemeProvider>
                <MuiThemeProvider theme={materialTheme}>
                  <CssBaseline />
<<<<<<< HEAD
                  <TenantContextProvider>
                    <UserPropsProvider>
                      <Layout>
                        <ProjectPropsProvider>
                          {isMap ? (
                            <>
                              {project ? (
                                <MapLayout />
                              ) : projects ? (
                                <MapLayout />
                              ) : null}
                              <div
                                style={
                                  config.tenantName === 'planet' ||
                                  config.tenantName === 'ttc'
                                    ? {}
                                    : { display: 'none' }
                                }
                              >
                                <PlayButton setshowVideo={setshowVideo} />
                              </div>
                            </>
                          ) : null}
                          <Component {...ProjectProps} />
                        </ProjectPropsProvider>
                      </Layout>
                    </UserPropsProvider>
                  </TenantContextProvider>
=======
                  <QueryParamsProvider>
                    <UserPropsProvider>
                      <Layout>
                        <ProjectPropsProvider>
                          <BulkCodeProvider>
                            {isMap ? (
                              <>
                                {project ? (
                                  <MapLayout />
                                ) : projects ? (
                                  <MapLayout />
                                ) : null}
                                <div
                                  style={
                                    config.tenantName === 'planet' ||
                                    config.tenantName === 'ttc'
                                      ? {}
                                      : { display: 'none' }
                                  }
                                >
                                  <PlayButton setshowVideo={setshowVideo} />
                                </div>
                              </>
                            ) : null}
                            <Component {...ProjectProps} />
                          </BulkCodeProvider>
                        </ProjectPropsProvider>
                      </Layout>
                    </UserPropsProvider>
                  </QueryParamsProvider>
>>>>>>> develop
                </MuiThemeProvider>
              </ThemeProvider>
            </Auth0Provider>
          </div>
        </div>
      </ErrorHandlingProvider>
    );
  }
}

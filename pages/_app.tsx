import type { EmotionCache } from '@emotion/react';
import type { ReactElement, ReactNode } from 'react';
import type { AppContext, AppInitialProps, AppProps } from 'next/app';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type { AbstractIntlMessages } from 'next-intl';
import type { NextPage } from 'next';
import type { SetState } from '../src/features/common/types/common';

import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import React, { useMemo } from 'react';
import TagManager from 'react-gtm-module';
import Router from 'next/router';
import App from 'next/app';
import { Auth0Provider } from '@auth0/auth0-react';
// NOTE - needs to be removed when old projects code is removed
import '../src/features/projects/styles/MapPopup.scss';
import '../src/theme/global.scss';
// NOTE - needs to be removed when old projects code is removed
import './../src/features/projects/styles/Projects.scss';
import './../src/features/common/Layout/Navbar/Navbar.scss';
import ThemeProvider from '../src/theme/themeContext';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { storeConfig } from '../src/utils/storeConfig';
import { browserNotCompatible } from '../src/utils/browsercheck';
import BrowserNotSupported from '../src/features/common/ErrorComponents/BrowserNotSupported';
import ProjectPropsProvider from '../src/features/common/Layout/ProjectPropsContext';
import { UserPropsProvider } from '../src/features/common/Layout/UserPropsContext';
import ErrorHandlingProvider from '../src/features/common/Layout/ErrorHandlingContext';
import dynamic from 'next/dynamic';
import { BulkCodeProvider } from '../src/features/common/Layout/BulkCodeContext';
import { AnalyticsProvider } from '../src/features/common/Layout/AnalyticsContext';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import materialTheme from '../src/theme/themeStyles';
import QueryParamsProvider from '../src/features/common/Layout/QueryParamsContext';
import { PlanetCashProvider } from '../src/features/common/Layout/PlanetCashContext';
import { PayoutsProvider } from '../src/features/common/Layout/PayoutsContext';
import { trpc } from '../src/utils/trpc';
// NOTE - needs to be removed when old projects code is removed
import MapHolder from '../src/features/projects/components/maps/MapHolder';
import { TenantProvider } from '../src/features/common/Layout/TenantContext';
import { CurrencyProvider } from '../src/features/common/Layout/CurrencyContext';
import {
  DEFAULT_TENANT,
  getTenantConfig,
  getTenantSlug,
} from '../src/utils/multiTenancy/helpers';
import { NextIntlClientProvider } from 'next-intl';
import { DonationReceiptProvider } from '../src/features/common/Layout/DonationReceiptContext';

const VideoContainer = dynamic(
  () => import('../src/features/common/LandingVideo'),
  {
    ssr: false,
  }
);

const Layout = dynamic(() => import('../src/features/common/Layout'), {
  ssr: false,
});

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

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export type NextPageWithLayout<P = PageComponentProps, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (
    page: ReactElement,
    pageComponentProps: PageComponentProps
  ) => ReactNode;
};

type AppPropsWithLayout = Omit<AppProps, 'pageProps'> & {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
  pageProps: PageProps;
};

export type PageProps = {
  tenantConfig: Tenant;
  messages?: AbstractIntlMessages;
  [key: string]: any;
};

export type PageComponentProps = {
  pageProps: PageProps;
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  isMobile: boolean;
};

const PlanetWeb = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppPropsWithLayout) => {
  const router = useRouter();
  const [isMap, setIsMap] = React.useState(false);
  const [currencyCode, setCurrencyCode] = React.useState('');
  const [browserCompatible, setBrowserCompatible] = React.useState(false);

  const { tenantConfig } = pageProps;

  const tagManagerArgs = {
    gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  };

  if (process.env.NODE_ENV !== 'production') {
    if (process.env.VERCEL_URL && typeof window !== 'undefined') {
      if (process.env.VERCEL_URL !== window.location.hostname) {
        router.replace(`https://${process.env.VERCEL_URL}`);
      }
    }
  }

  React.useEffect(() => {
    storeConfig(tenantConfig);
  }, []);

  React.useEffect(() => {
    if (router.pathname.includes('projects-archive')) {
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

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 481;
  }, [typeof window !== 'undefined' && window.innerWidth]);

  const pageComponentProps = {
    pageProps,
    currencyCode,
    setCurrencyCode,
    isMobile,
  };

  const [showVideo, setshowVideo] = React.useState(true);

  // if localShowVideo is undefined
  // set localShowVideo is true and show the video
  // if localShowVideo is true show the video
  // if localShowVideo is false hide the video

  const [localShowVideo, setLocalShowVideo] = React.useState(false);

  React.useEffect(() => {
    if (router.pathname.endsWith('projects-archive')) {
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

  const getLayout = Component.getLayout ?? ((page) => page);
  const pageContent = getLayout(
    <Component {...pageComponentProps} />,
    pageComponentProps
  );

  if (browserCompatible) {
    return <BrowserNotSupported />;
  } else {
    return tenantConfig ? (
      <NextIntlClientProvider
        locale={(router.query?.locale as string) ?? 'en'}
        messages={pageProps.messages}
      >
        <CacheProvider value={emotionCache}>
          <ErrorHandlingProvider>
            <TenantProvider initialTenantConfig={pageProps.tenantConfig}>
              <QueryParamsProvider>
                <div>
                  <div
                    style={
                      showVideo &&
                      (tenantConfig.config.slug === 'planet' ||
                        tenantConfig.config.slug === 'ttc')
                        ? {}
                        : { display: 'none' }
                    }
                  >
                    <VideoContainer setshowVideo={setshowVideo} />
                  </div>

                  <div
                    style={
                      showVideo &&
                      (tenantConfig.config.slug === 'planet' ||
                        tenantConfig.config.slug === 'ttc')
                        ? { display: 'none' }
                        : {}
                    }
                  >
                    <Auth0Provider
                      domain={process.env.AUTH0_CUSTOM_DOMAIN!}
                      clientId={
                        tenantConfig.config?.auth0ClientId
                          ? tenantConfig.config.auth0ClientId
                          : process.env.AUTH0_CLIENT_ID
                      }
                      redirectUri={
                        typeof window !== 'undefined'
                          ? window.location.origin
                          : ''
                      }
                      audience={'urn:plant-for-the-planet'}
                      cacheLocation={'localstorage'}
                      onRedirectCallback={onRedirectCallback}
                      useRefreshTokens={true}
                    >
                      <ThemeProvider>
                        <MuiThemeProvider theme={materialTheme}>
                          <CssBaseline />
                          <UserPropsProvider>
                            <CurrencyProvider>
                              <PlanetCashProvider>
                                <PayoutsProvider>
                                  <Layout>
                                    <ProjectPropsProvider>
                                      <BulkCodeProvider>
                                        <AnalyticsProvider>
                                          <DonationReceiptProvider>
                                            {isMap ? (
                                              <MapHolder
                                                setshowVideo={setshowVideo}
                                              />
                                            ) : null}
                                            {pageContent}
                                          </DonationReceiptProvider>
                                        </AnalyticsProvider>
                                      </BulkCodeProvider>
                                    </ProjectPropsProvider>
                                  </Layout>
                                </PayoutsProvider>
                              </PlanetCashProvider>
                            </CurrencyProvider>
                          </UserPropsProvider>
                        </MuiThemeProvider>
                      </ThemeProvider>
                    </Auth0Provider>
                  </div>
                </div>
              </QueryParamsProvider>
            </TenantProvider>
          </ErrorHandlingProvider>
        </CacheProvider>
      </NextIntlClientProvider>
    ) : (
      <></>
    );
  }
};

PlanetWeb.getInitialProps = async (
  context: AppContext
): Promise<AppInitialProps & { pageProps: PageProps }> => {
  const ctx = await App.getInitialProps(context);

  const _tenantSlug = await getTenantSlug(
    context.ctx.req?.headers.host as string
  );

  const tenantSlug = _tenantSlug ?? DEFAULT_TENANT;

  const tenantConfig = await getTenantConfig(tenantSlug);

  return {
    ...ctx,
    pageProps: {
      ...ctx.pageProps,
      tenantConfig,
    },
  };
};

export default trpc.withTRPC(PlanetWeb);

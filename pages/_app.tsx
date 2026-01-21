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
import { useEffect, useMemo, useState } from 'react';
import TagManager from 'react-gtm-module';
import Router from 'next/router';
import App from 'next/app';
import { Auth0Provider } from '@auth0/auth0-react';
import '../src/theme/global.scss';
import ThemeProvider from '../src/theme/themeContext';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { storeConfig } from '../src/utils/storeConfig';
import { browserNotCompatible } from '../src/utils/browserCheck';
import BrowserNotSupported from '../src/features/common/ErrorComponents/BrowserNotSupported';
import { UserPropsProvider } from '../src/features/common/Layout/UserPropsContext';
import dynamic from 'next/dynamic';
import { BulkCodeProvider } from '../src/features/common/Layout/BulkCodeContext';
import { AnalyticsProvider } from '../src/features/common/Layout/AnalyticsContext';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import materialTheme from '../src/theme/themeStyles';
import { PlanetCashProvider } from '../src/features/common/Layout/PlanetCashContext';
import { PayoutsProvider } from '../src/features/common/Layout/PayoutsContext';
import { TenantProvider } from '../src/features/common/Layout/TenantContext';
import {
  DEFAULT_TENANT,
  getTenantConfig,
  getTenantSlug,
} from '../src/utils/multiTenancy/helpers';
import { NextIntlClientProvider } from 'next-intl';
import { DonationReceiptProvider } from '../src/features/common/Layout/DonationReceiptContext';
import { StoreInitializer } from '../src/features/common/StoreInitializer/StoreInitializer';

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
  const [currencyCode, setCurrencyCode] = useState('');
  const [browserCompatible, setBrowserCompatible] = useState(false);

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

  useEffect(() => {
    storeConfig(tenantConfig);
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
      TagManager.initialize(tagManagerArgs);
    }
  }, []);

  useEffect(() => {
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
          <TenantProvider initialTenantConfig={pageProps.tenantConfig}>
            <Auth0Provider
              domain={process.env.AUTH0_CUSTOM_DOMAIN!}
              clientId={
                tenantConfig.config?.auth0ClientId
                  ? tenantConfig.config.auth0ClientId
                  : process.env.AUTH0_CLIENT_ID
              }
              redirectUri={
                typeof window !== 'undefined' ? window.location.origin : ''
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
                    <StoreInitializer />
                    <PlanetCashProvider>
                      <PayoutsProvider>
                        <Layout>
                          <BulkCodeProvider>
                            <AnalyticsProvider>
                              <DonationReceiptProvider>
                                {pageContent}
                              </DonationReceiptProvider>
                            </AnalyticsProvider>
                          </BulkCodeProvider>
                        </Layout>
                      </PayoutsProvider>
                    </PlanetCashProvider>
                  </UserPropsProvider>
                </MuiThemeProvider>
              </ThemeProvider>
            </Auth0Provider>
          </TenantProvider>
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

export default PlanetWeb;

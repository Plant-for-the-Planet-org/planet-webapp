/* processing values from environment */
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const initialProps = {
  mediaPath: publicRuntimeConfig.mediaPath // relative URI on server, where images are located (further sub-paths must be specified in application)
};

export const context = {
  api_url: publicRuntimeConfig.API_ENDPOINT,
  debug: publicRuntimeConfig.debug, // local console debugging switch
  currency: publicRuntimeConfig.currency,
  bugsnagApiKey: publicRuntimeConfig.bugsnagApiKey,
  android: {
    appId: publicRuntimeConfig.androidAppId
  },
  ios: {
    appId: publicRuntimeConfig.iosAppId
  },
  locationApikKey: publicRuntimeConfig.locationApikKey,
  googleMapApiKey: publicRuntimeConfig.googleMapApiKey
};

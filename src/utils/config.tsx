/* processing values from environment */
// import getConfig from 'next/config';
import { publicRuntimeConfig } from './../../next.config';

// const { publicRuntimeConfig } = getConfig();

export const context = {
  api_url: publicRuntimeConfig.API_ENDPOINT,
};

 
module.exports ={
  // your config for other plugins or the general next.js here...
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    API_ENDPOINT: 'https://app-development.plant-for-the-planet.org',
    AUTH0_CUSTOM_DOMAIN: "",
    AUTH0_CLIENT_ID: "",
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_ENDPOINT: 'https://app-development.plant-for-the-planet.org',
    googleMapApiKey:'',
    debug:true,
    currency:'EUR',
    mapIdsInventory:'',
    bugsnagApiKey:'',
    androidAppId:'org.pftp',
    iosAppId:'1444740626',
    locationApikKey:'',
    mediaPath:'/media/cache'
  }
};
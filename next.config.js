 
module.exports ={
  // your config for other plugins or the general next.js here...
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    API_ENDPOINT: 'https://app-development.plant-for-the-planet.org',
    OAUTH0_DOMAIN: "",
    CLIENT_SECRET: "",
    CLIENT_ID: "",
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
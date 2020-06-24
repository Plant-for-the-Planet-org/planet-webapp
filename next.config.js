const withSvgr = require("next-svgr");
 
module.exports = withSvgr({
  // your config for other plugins or the general next.js here...
  devIndicators: {
    autoPrerender: false,
  }
});
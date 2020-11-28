import ee from '@google/earthengine';
import Cors from 'cors';

var privateKey = {
  private_key: process.env.GCP_PRIVATE_KEY,
  client_email: process.env.GCP_SERVICE_ACCOUNT,
};

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async (req, res) => {
  // await runMiddleware(req, res, cors);

  ee.data.authenticateViaPrivateKey(
    privateKey,
    runAnalysis(req, res),
    function (e) {
      console.error('Authentication error: ' + e);
    }
  );
};

var runAnalysis = function (req, res) {
  ee.initialize(
    null,
    null,
    async function () {
      console.log('Earth Engine library initialized.');
      //Start Server
      try {
        console.log('request - ', req.body);
        const sitePolygon = ee.FeatureCollection(req.body);
        // ... run analysis ...
        /**
         * Function to mask clouds based on the pixel_qa band of Landsat 8 SR data.
         * @param {ee.Image} image input Landsat 8 SR image
         * @return {ee.Image} cloudmasked Landsat 8 image
         */
        function maskL8sr(image) {
          // Bits 3 and 5 are cloud shadow and cloud, respectively.
          var cloudShadowBitMask = 1 << 3;
          var cloudsBitMask = 1 << 5;
          // Get the pixel QA band.
          var qa = image.select('pixel_qa');
          // Both flags should be set to zero, indicating clear conditions.
          var mask = qa
            .bitwiseAnd(cloudShadowBitMask)
            .eq(0)
            .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
          return image.updateMask(mask);
        }

        var dataset = ee
          .ImageCollection('LANDSAT/LC08/C01/T1_SR')
          .filterDate('2020-01-01', '2020-12-31')
          .map(maskL8sr);

        var image = dataset.median().clip(sitePolygon);

        var visParams = {
          bands: ['B4', 'B3', 'B2'],
          min: 0,
          max: 3000,
          gamma: 1.4,
        };
        // Map.addLayer(dataset.median(), visParams);

        const mapId = await image.getMap(visParams);

        console.log('response sent - ' + mapId.urlFormat);
        return res.status(200).json({
          data: mapId.urlFormat,
        });
      } catch (err) {
        console.log(err);
      }
    },
    function (e) {
      console.error('Initialization error: ' + e);
    }
  );
};

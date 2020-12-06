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
        console.log('request');
        // ... run analysis ...
        const sitePolygon = ee.FeatureCollection(req.body);
        var evi_2015 = ee
          .ImageCollection('LANDSAT/LC08/C01/T1_32DAY_EVI')
          .filterDate('2015-03-01', '2015-05-31');
        var evi_2020 = ee
          .ImageCollection('LANDSAT/LC08/C01/T1_32DAY_EVI')
          .filterDate('2020-03-01', '2020-05-31');

        var evi_2015_clipped = evi_2015
          .filterBounds(sitePolygon)
          .max()
          .clip(sitePolygon)
          .rename('EVI');
        var evi_2020_clipped = evi_2020
          .filterBounds(sitePolygon)
          .max()
          .clip(sitePolygon)
          .rename('EVI');

        var evi_difference = evi_2020_clipped
          .subtract(evi_2015_clipped)
          .gt(0.05)
          .selfMask();
        // var evi_difference = evi_2020_clipped.subtract(evi_2015_clipped);

        const mapId = await evi_difference.getMap({
          min: -1,
          max: 1,
          palette: ['FF0000', 'FFFFFF', '00FF00'],
        });
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

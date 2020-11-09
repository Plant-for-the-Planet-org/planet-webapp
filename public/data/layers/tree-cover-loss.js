export default [
  // DECODED RASTER LAYER
  {
    id: 'loss',
    name: 'Tree cover loss',
    config: {
      type: 'raster',
      source: {
        type: 'raster',
        tiles: [
          'https://storage.googleapis.com/wri-public/Hansen_16/tiles/hansen_world/v1/tc30/{z}/{x}/{y}.png',
        ],
        minzoom: 0,
        maxzoom: 12,
      },
    },
    legendConfig: {
      enabled: true,
    },
    decodeConfig: [
      {
        default: '2001-01-01',
        key: 'startDate',
        required: true,
      },
      {
        default: '2018-12-31',
        key: 'endDate',
        required: true,
      },
    ],
    timelineConfig: {
      step: 1,
      speed: 250,
      interval: 'years',
      dateFormat: 'YYYY',
      trimEndDate: '2018-12-31',
      maxDate: '2018-12-31',
      minDate: '2001-01-01',
      canPlay: true,
      railStyle: {
        background: '#DDD',
      },
      trackStyle: [
        {
          background: '#ff845e',
        },
        {
          background: '#ffd991',
        },
      ],
    },
    decodeFunction: `
          // values for creating power scale, domain (input), and range (output)
          float domainMin = 0.;
          float domainMax = 255.;
          float rangeMin = 0.;
          float rangeMax = 255.;
    
          float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
          float intensity = color.r * 255.;
    
          // get the min, max, and current values on the power scale
          float minPow = pow(domainMin, exponent - domainMin);
          float maxPow = pow(domainMax, exponent);
          float currentPow = pow(intensity, exponent);
    
          // get intensity value mapped to range
          float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
          // a value between 0 and 255
          alpha = zoom < 13. ? scaleIntensity / 255. : color.g;
    
          float year = 2000.0 + (color.b * 255.);
          // map to years
          if (year >= startYear && year <= endYear && year >= 2001.) {
            color.r = 255. / 255.;
            color.g = (228. - zoom + 102. - 3. * scaleIntensity / zoom) / 255.;
            color.b = (-100. - zoom + 153. - intensity / zoom) / 255.;
          } else {
            alpha = 0.;
          }
        `,
  },
];

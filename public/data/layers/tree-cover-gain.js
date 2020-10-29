export default [
  // RASTER LAYER
  {
    id: 'gain',
    name: 'Tree cover gain',
    config: {
      type: 'raster',
      source: {
        type: 'raster',
        tiles: [
          'https://earthengine.google.org/static/hansen_2013/gain_alpha/{z}/{x}/{y}.png',
        ],
        minzoom: 3,
        maxzoom: 12,
      },
    },
    legendConfig: {
      type: 'basic',
      items: [{ name: 'Tree cover gain', color: '#6D6DE5' }],
    },
  },
];

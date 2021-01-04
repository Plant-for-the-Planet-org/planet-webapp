import React, { ReactElement } from 'react';
import mapboxgl from 'mapbox-gl';
import syncMove from '@mapbox/mapbox-gl-sync-move';
import MapboxCompare from 'mapbox-gl-compare';

interface Props {
  mapRef: any;
  siteImagery: any;
  projectZoom: any;
  projectCenter: any;
}

export default function MapCompare({
  mapRef,
  siteImagery,
  projectCenter,
  projectZoom,
}: Props): ReactElement {
  const accessToken = process.env.MAPBOXGL_ACCESS_TOKEN;
  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  React.useEffect(() => {
    var before = new mapboxgl.Map({
      container: 'before', // Container ID
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [`${siteImagery[0]}`],
            tileSize: 256,
            attribution:
              'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: projectCenter,
      zoom: projectZoom,
    });

    var after = new mapboxgl.Map({
      container: 'after', // Container ID
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [`${siteImagery[1]}`],
            tileSize: 256,
            attribution:
              'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: projectCenter,
      zoom: projectZoom,
    });

    // A selector or reference to HTML element
    var container = '#comparison-container';

    new MapboxCompare(before, after, container, {
      mousemove: true, // Optional. Set to true to enable swiping during cursor movement.
      orientation: 'vertical', // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
    });

    syncMove(before, mapRef.current.getMap());
  }, []);
  return (
    <div style={{ userSelect: 'none' }} id="comparison-container">
      <div className="comparison-map" id="before"></div>
      <div className="comparison-map" id="after"></div>
    </div>
  );
}

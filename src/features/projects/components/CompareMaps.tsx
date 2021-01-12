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
      style: EMPTY_STYLE,
      center: projectCenter,
      zoom: projectZoom,
    });

    var after = new mapboxgl.Map({
      container: 'after', // Container ID
      style: EMPTY_STYLE,
      center: projectCenter,
      zoom: projectZoom,
    });

    before.on('load', function () {
      before.addSource('basemap', {
        type: 'raster',
        tiles: [`${siteImagery[2017]}`],
        tileSize: 256,
        attribution: 'layer attribution'
      });
      before.addLayer({
        'id': 'basemap-layer',
        'type': 'raster',
        'source': 'basemap',
      });
    });


    after.on('load', function () {
      after.addSource('basemap', {
        type: 'raster',
        tiles: [`${siteImagery[2020]}`],
        tileSize: 256,
        attribution: 'layer attribution'
      });
      after.addLayer({
        'id': 'basemap-layer',
        'type': 'raster',
        'source': 'basemap',
      });
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

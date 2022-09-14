import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import * as d3 from 'd3-ease';
import * as turf from '@turf/turf';

export default function zoomToProjectSite(
  geoJson: Object | null,
  selectedSite: number,
  viewport: Object,
  setViewPort: Function,
  setSiteViewPort: Function,
  duration = 1200
) {
  if (viewport.width && viewport.height) {
    // decide which paddings to use (for mobile or normal)
    let isPortrait = true;
    if (screen.orientation) {
      isPortrait =
        screen.orientation.angle === 0 || screen.orientation.angle === 180;
    } else if (window.orientation) {
      isPortrait = window.orientation === 0 || window.orientation === 180;
    }
    const isMobile = window.innerWidth <= 767 && isPortrait;
    //console.log("zoomToProjectSite", viewport, viewport.width, window.innerWidth, viewport.height, window.innerHeight);

    const bbox = turf.bbox(geoJson.features[selectedSite]);
    const { longitude, latitude, zoom } = new WebMercatorViewport(
      viewport
    ).fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      {
        padding: {
          top: 50,
          bottom: isMobile ? 300 : 50,
          left: isMobile ? 50 : 400,
          right: isMobile ? 50 : 100,
        },
      }
    );
    let defaultZoom = 15;
    if (zoom < defaultZoom) {
      defaultZoom = zoom;
    }

    const newViewport = {
      ...viewport,
      longitude,
      latitude,
      zoom: defaultZoom,
      transitionDuration: duration,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic,
    };
    setViewPort(newViewport);
    setSiteViewPort({ center: [longitude, latitude], zoom: defaultZoom });
  } else {
    const newViewport = {
      ...viewport,
      height: window.innerHeight,
      width: window.innerWidth,
    };
    setViewPort(newViewport);
  }
}

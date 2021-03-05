import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import * as d3 from 'd3-ease';
import * as turf from '@turf/turf';

export default function zoomToProjectSite(
  geoJson: Object | null,
  selectedSite: number,
  viewport: Object,
  isMobile: boolean,
  setViewPort: Function,
  duration = 1200
) {
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
        bottom: isMobile ? 120 : 50,
        left: isMobile ? 50 : 400,
        right: isMobile ? 50 : 100,
      },
    }
  );
  const newViewport = {
    ...viewport,
    longitude,
    latitude,
    zoom,
    transitionDuration: duration,
    transitionInterpolator: new FlyToInterpolator(),
    transitionEasing: d3.easeCubic,
  };
  setViewPort(newViewport);
}

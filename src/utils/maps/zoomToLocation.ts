import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import * as d3 from 'd3-ease';
import * as turf from '@turf/turf';

export default function zoomToProjectSite(
  viewport: Object,
  setViewPort: Function,
  longitude: number,
  latitude: number,
  zoom: number,
  duration = 1200
) {
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

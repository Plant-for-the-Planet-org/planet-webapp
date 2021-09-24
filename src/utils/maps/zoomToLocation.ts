import { FlyToInterpolator } from 'react-map-gl';
import * as d3 from 'd3-ease';

export default function zoomToLocation(
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

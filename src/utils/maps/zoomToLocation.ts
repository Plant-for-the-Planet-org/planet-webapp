import { FlyToInterpolator } from 'react-map-gl';
import * as d3 from 'd3-ease';
import { ViewPort } from '../../features/common/types/ProjectPropsContextInterface';
import { SetState } from '../../features/common/types/common';

export default function zoomToLocation(
  viewport: ViewPort,
  setViewPort: SetState<ViewPort>,
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

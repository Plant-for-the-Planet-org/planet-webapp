import type { ViewPort } from '../../features/common/types/ProjectPropsContextInterface';
import type { SetState } from '../../features/common/types/common';

import { FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';

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
    transitionEasing: easeCubic,
  };
  setViewPort(newViewport);
}

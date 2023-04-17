import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import * as d3 from 'd3-ease';
import * as turf from '@turf/turf';
import { getRequest } from '../apiRequests/api';
import { handleError, APIError, SerializedError } from '@planet-sdk/common';
import { SetState } from '../../features/common/types/common';

export function zoomToPlantLocation(
  coordinates: any,
  viewport: Object,
  isMobile: boolean,
  setViewPort: Function,
  duration = 1200
) {
  if (viewport.width && viewport.height) {
    const polygon = turf.polygon([coordinates]);
    const bbox = turf.bbox(polygon);
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
  } else {
    const newViewport = {
      ...viewport,
      height: window.innerHeight,
      width: window.innerWidth,
    };
    setViewPort(newViewport);
  }
}

export async function getAllPlantLocations(
  project: string,
  setErrors: SetState<SerializedError[] | null>,
  redirect: (url: string) => void
) {
  try {
    const result = await getRequest(
      `/app/plantLocations/${project}`,
      {
        _scope: 'extended',
      },
      '1.0.4'
    );
    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (err) {
    setErrors(handleError(err as APIError));
    redirect('/');
  }
}

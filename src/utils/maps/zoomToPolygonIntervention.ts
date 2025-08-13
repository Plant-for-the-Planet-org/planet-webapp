import type { APIError, SerializedError } from '@planet-sdk/common';
import type { SetState } from '../../features/common/types/common';
import type { Intervention } from '../../features/common/types/intervention';
import type { Position } from 'geojson';
import type { ViewPort } from '../../features/common/types/ProjectPropsContextInterface';

import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import { polygon } from '@turf/helpers';
import bbox from '@turf/bbox';
import { getRequest } from '../apiRequests/api';
import { handleError } from '@planet-sdk/common';
/**
 * Zooms the map to a multiple tree plant location
 * @param {Position} coordinates
 * @param {ViewPort} viewport
 * @param {boolean} isMobile
 * @param setViewPort - function to set the viewport
 * @param {number} duration - in ms
 */
export function zoomToPolygonIntervention(
  coordinates: Position[],
  viewport: ViewPort,
  isMobile: boolean,
  setViewPort: SetState<ViewPort>,
  duration = 1200
) {
  if (viewport.width && viewport.height) {
    const polygonFeature = polygon([coordinates]);
    const bounds = bbox(polygonFeature);
    const { longitude, latitude, zoom } = new WebMercatorViewport(
      viewport
    ).fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
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
      transitionEasing: easeCubic,
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

export async function getInterventions(
  tenant: string | undefined,
  project: string,
  setErrors: SetState<SerializedError[] | null>,
  redirect: (url: string) => void
): Promise<Intervention[] | null | void> {
  try {
    const result = await getRequest<Intervention[]>({
      tenant,
      url: `/app/interventions/${project}`,
      queryParams: {
        _scope: 'extended',
      },
      version: '1.0.4',
    });
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

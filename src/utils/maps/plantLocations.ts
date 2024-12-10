import type { APIError, SerializedError } from '@planet-sdk/common';
import type { SetState } from '../../features/common/types/common';
import type { PlantLocation } from '../../features/common/types/plantLocation';
import type { Position } from 'geojson';
import type { ViewPort } from '../../features/common/types/ProjectPropsContextInterface';

import { FlyToInterpolator, WebMercatorViewport } from 'react-map-gl';
import * as d3 from 'd3-ease';
import * as turf from '@turf/turf';
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
export function zoomToPolygonPlantLocation(
  coordinates: Position[],
  viewport: ViewPort,
  isMobile: boolean,
  setViewPort: SetState<ViewPort>,
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
  tenant: string | undefined,
  project: string,
  setErrors: SetState<SerializedError[] | null>,
  redirect: (url: string) => void
): Promise<PlantLocation[] | null | void> {
  try {
    const result = await getRequest<PlantLocation[]>(
      tenant,
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

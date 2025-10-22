import type { Position } from 'geojson';
import type { ViewState } from 'react-map-gl-v7/maplibre';
import type { MapLibreRef } from '../../features/common/types/map';

import { polygon } from '@turf/helpers';
import bbox from '@turf/bbox';

export function zoomToPolygonIntervention(
  coordinates: Position[],
  mapRef: MapLibreRef,
  handleViewStateChange: (viewState: Partial<ViewState>) => void,
  duration = 3000
) {
  if (!mapRef.current) {
    return;
  }
  const polygonFeature = polygon([coordinates]);
  const bounds = bbox(polygonFeature);
  const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current;
  map.fitBounds(
    [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ],
    {
      duration: duration,
      maxZoom: 17,
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
    }
  );
  map.once('moveend', () => {
    const center = map.getCenter();
    const currentZoom = map.getZoom();
    const newViewState: ViewState = {
      longitude: center.lng,
      latitude: center.lat,
      zoom: currentZoom,
      bearing: 0,
      pitch: 0,
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    };
    handleViewStateChange(newViewState);
  });
}

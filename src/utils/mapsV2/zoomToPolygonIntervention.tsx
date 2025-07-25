import type { Position } from 'geojson';
import type { ViewState } from 'react-map-gl-v7/maplibre';
import type { MapRef } from '../../features/common/types/projectv2';

import * as turf from '@turf/turf';

export function zoomToPolygonIntervention(
  coordinates: Position[],
  mapRef: MapRef,
  handleViewStateChange: (viewState: Partial<ViewState>) => void,
  duration = 3000
) {
  if (!mapRef.current) {
    return;
  }
  const polygon = turf.polygon([coordinates]);
  const bbox = turf.bbox(polygon);
  const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current;
  map.fitBounds(
    [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ],
    {
      duration: duration,
      maxZoom: 17,
    }
  );
  map.once('moveend', () => {
    const center = map.getCenter();
    const defaultZoom = 17;
    const newViewState: ViewState = {
      longitude: center.lng,
      latitude: center.lat,
      zoom: defaultZoom,
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

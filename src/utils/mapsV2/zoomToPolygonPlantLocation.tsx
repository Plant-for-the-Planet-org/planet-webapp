import * as turf from '@turf/turf';
import { SetState } from '../../features/common/types/common';
import { Position } from 'geojson';
import { ViewState } from 'react-map-gl-v7/maplibre';
import { MapRef } from './zoomToProjectSite';

export function zoomToPolygonPlantLocation(
  coordinates: Position[],
  mapRef: MapRef,
  setViewState: SetState<ViewState>,
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
    setViewState(newViewState);
  });
}

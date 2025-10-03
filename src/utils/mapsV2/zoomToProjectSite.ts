import type { SitesGeoJSON } from '../../features/common/types/ProjectPropsContextInterface';
import type { ViewState } from 'react-map-gl-v7';
import type { Map } from 'maplibre-gl';
import type { MapRef } from '../../features/common/types/projectv2';

import bbox from '@turf/bbox';
import { MAIN_MAP_ANIMATION_DURATIONS } from '../projectV2';
import { DEFAULT_VIEW_STATE } from './mapDefaults';

export function zoomOutMap(map: Map, callback: () => void) {
  map.flyTo({
    center: [DEFAULT_VIEW_STATE.longitude, DEFAULT_VIEW_STATE.latitude],
    zoom: DEFAULT_VIEW_STATE.zoom,
    duration: MAIN_MAP_ANIMATION_DURATIONS.ZOOM_OUT,
  });

  map.once('moveend', () => callback());
}
export function zoomInToProjectSite(
  mapRef: MapRef,
  geoJson: SitesGeoJSON | null,
  selectedSite: number,
  handleViewStateChange: (viewState: Partial<ViewState>) => void,
  duration = 1200
) {
  if (!geoJson || !mapRef.current) {
    console.warn('Unable to zoom: geoJson or mapRef is not available');
    return;
  }

  const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current;

  const feature = geoJson.features?.[selectedSite];
  if (!feature || !feature.geometry) {
    console.warn(
      'zoomInToProjectSite: invalid selectedSite or missing geometry',
      { selectedSite, featuresLength: geoJson.features?.length ?? 0 }
    );
    return;
  }
  // Get the bounding box of the selected site
  const bounds = bbox(feature);

  // Fit the map to the bounding box
  map.fitBounds(
    [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ],
    {
      duration: duration,
      maxZoom: 14,
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

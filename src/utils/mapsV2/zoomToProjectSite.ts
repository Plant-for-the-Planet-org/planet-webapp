import type { SitesGeoJSON } from '../../features/common/types/ProjectPropsContextInterface';
import type { ViewState } from 'react-map-gl-v7';
import type { Map } from 'maplibre-gl';
import type { MapRef } from '../../features/common/types/projectv2';

import * as turf from '@turf/turf';
import { DEFAULT_VIEW_STATE } from '../../features/projectsV2/ProjectsMapContext';

export function zoomOutMap(map: Map, callback: () => void) {
  map.flyTo({
    center: [DEFAULT_VIEW_STATE.longitude, DEFAULT_VIEW_STATE.latitude],
    zoom: DEFAULT_VIEW_STATE.zoom,
    duration: 1600,
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
  const feature = geoJson.features[selectedSite];
  if (!feature) {
    console.warn(`Selected site ${selectedSite} not found in geoJson`);
    return;
  }
  // Get the bounding box of the selected site
  const bbox = turf.bbox(feature);

  // Fit the map to the bounding box
  map.fitBounds(
    [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
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

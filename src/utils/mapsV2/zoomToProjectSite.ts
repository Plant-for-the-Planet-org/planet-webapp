import type {
  MapLibreRef,
  ProjectSiteFeature,
  ProjectSiteFeatureCollection,
} from '../../features/common/types/map';
import type { ViewState } from 'react-map-gl/maplibre';
import type { Map } from 'maplibre-gl';

import { bbox } from '@turf/bbox';
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
interface ZoomInToProjectSiteOptions {
  mapRef: MapLibreRef;
  site: ProjectSiteFeature | ProjectSiteFeatureCollection | null | undefined;
  onViewStateChange: (viewState: Partial<ViewState>) => void;
  duration?: number;
}

export function zoomInToProjectSite({
  mapRef,
  site,
  onViewStateChange,
  duration = 1200,
}: ZoomInToProjectSiteOptions) {
  if (!site || !mapRef.current) {
    console.warn('Unable to zoom: site or mapRef is not available');
    return;
  }

  const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current;

  // bbox skips null geometries; with no shapes at all it returns Infinity values.
  const bounds = bbox(site);
  if (!bounds.every(Number.isFinite)) {
    console.warn('zoomInToProjectSite: site has no geometry');
    return;
  }

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
    onViewStateChange(newViewState);
  });
}

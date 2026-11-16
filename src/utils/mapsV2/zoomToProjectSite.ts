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
export function zoomInToProjectSite(
  mapRef: MapLibreRef,
  geoJson: ProjectSiteFeatureCollection | null,
  // null fits every site in geoJson, so no shape ends up outside the view.
  selectedSiteIndex: number | null,
  handleViewStateChange: (viewState: Partial<ViewState>) => void,
  duration = 1200
) {
  if (!geoJson || !mapRef.current) {
    console.warn('Unable to zoom: geoJson or mapRef is not available');
    return;
  }

  const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current;

  const sitesToFit =
    selectedSiteIndex === null
      ? geoJson.features ?? []
      : [geoJson.features?.[selectedSiteIndex]];
  const sitesWithGeometry = sitesToFit.filter(
    (site): site is ProjectSiteFeature => Boolean(site?.geometry)
  );
  if (sitesWithGeometry.length === 0) {
    console.warn(
      'zoomInToProjectSite: invalid selectedSiteIndex or missing geometry',
      { selectedSiteIndex, featuresLength: geoJson.features?.length ?? 0 }
    );
    return;
  }
  const bounds = bbox({
    type: 'FeatureCollection',
    features: sitesWithGeometry,
  });

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

import * as turf from '@turf/turf';
import { SitesGeoJSON } from '../../features/common/types/ProjectPropsContextInterface';
import { SetState } from '../../features/common/types/common';
import { ViewState } from 'react-map-gl-v7';
import { Map } from 'maplibre-gl';
import { DEFAULT_VIEW_STATE } from '../../features/projectsV2/ProjectsMapContext';
import { MutableRefObject } from 'react';

export type MapRef = MutableRefObject<ExtendedMapLibreMap | null>;
interface ExtendedMapLibreMap extends Map {
  getMap?: () => Map;
}
export function zoomOutMap(map: Map, callback: () => void) {
  map.flyTo({
    center: [DEFAULT_VIEW_STATE.longitude, DEFAULT_VIEW_STATE.latitude],
    zoom: 2,
    duration: 1600,
  });

  map.once('moveend', () => {
    callback();
  });
}
export function zoomInToProjectSite(
  mapRef: MapRef,
  geoJson: SitesGeoJSON | null,
  selectedSite: number,
  setViewState: SetState<ViewState>,
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
    }
  );
  map.once('moveend', () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const defaultZoom = Math.min(15, zoom);
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

import type { ViewState } from 'react-map-gl-v7/maplibre';
import type { MapRef } from '../../features/common/types/projectv2';
import * as d3 from 'd3-ease';

export default function zoomOut(
  handleViewStateChange: (viewState: Partial<ViewState>) => void,
  mapRef: MapRef,
  duration = 1000
) {
  if (!mapRef.current) {
    return;
  }
  const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current;
  
  // Get current center coordinates
  const center = map.getCenter();
  const newZoom = 12;

  map.flyTo({
    center: [center.lng, center.lat],
    zoom: newZoom,
    duration: duration,
    easing: d3.easeCubic
  });

  // Update view state after animation completes
  map.once('moveend', () => {
    const newViewState: ViewState = {
      longitude: center.lng,
      latitude: center.lat,
      zoom: newZoom,
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
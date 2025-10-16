import type { ViewState } from 'react-map-gl-v7/maplibre';
import type { MapLibreRef } from '../../features/common/types/map';

export default function zoomToLocation(
  handleViewStateChange: (viewState: Partial<ViewState>) => void,
  longitude: number,
  latitude: number,
  zoom = 10,
  duration = 1200,
  mapRef: MapLibreRef
) {
  if (!mapRef.current) {
    return;
  }
  const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current;
  map.flyTo({
    center: [longitude, latitude],
    zoom: zoom,
    duration: duration,
  });
  map.once('moveend', () => {
    const newViewState: ViewState = {
      longitude: longitude,
      latitude: latitude,
      zoom: zoom,
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

import { SetState } from '../../features/common/types/common';
import { ViewState } from 'react-map-gl-v7';
import { MapRef } from './zoomToProjectSite';

export default function zoomToLocation(
  viewState: ViewState,
  setViewState: SetState<ViewState>,
  longitude: number,
  latitude: number,
  zoom: number,
  duration = 1200,
  mapRef: MapRef
) {
  if (!mapRef.current) {
    return;
  }
  const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current;
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
    setViewState(newViewState);
  });
}

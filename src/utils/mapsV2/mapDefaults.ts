import type { ViewState, StyleSpecification } from 'react-map-gl/maplibre';

export interface MapState {
  mapStyle: StyleSpecification;
  dragPan: boolean;
  scrollZoom: boolean;
  minZoom: number;
  maxZoom: number;
}

export const EMPTY_STYLE = {
  version: 8,
  sources: {},
  layers: [] as StyleSpecification['layers'],
} as const;

export const DEFAULT_VIEW_STATE: ViewState = {
  longitude: 0,
  latitude: 0,
  zoom: 2,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

export const DEFAULT_MAP_STATE: MapState = {
  mapStyle: EMPTY_STYLE,
  dragPan: true,
  scrollZoom: true,
  minZoom: 1,
  maxZoom: 20,
};

import type {
  NonPlantingInterventionTypes,
  ProjectSite,
} from '@planet-sdk/common';
import type { MutableRefObject } from 'react';
import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { MapLayerOptionsType } from '../../../utils/mapsV2/mapSettings.config';

export type Bound = [number, number, number, number];

// Project site
export type ProjectSiteFeatureCollection = FeatureCollection<
  Polygon | MultiPolygon,
  ProjectSite | Record<string, never>
>;

export type ProjectSiteFeature = Feature<
  Polygon | MultiPolygon,
  ProjectSite | Record<string, never>
>;

// intervention

export interface InterventionProperties {
  id: string;
  highlightLine?: boolean;
  opacity?: number;
  dateDiff?: string;
  type?:
    | 'single-tree-registration'
    | 'multi-tree-registration'
    | NonPlantingInterventionTypes;
}

export type InterventionGeometryType = Point | Polygon;

export type InterventionFeature = Feature<
  InterventionGeometryType,
  InterventionProperties
>;

/**
 * Standard envelope every TreeMapper API response is wrapped in. The actual
 * payload always lives in `data`.
 */
export interface TreemapperApiResponse<T> {
  statusCode: number;
  message: string;
  error: string | null;
  data: T | null;
  code?: string;
}

// Map
export interface ExtendedMapLibreMap extends MapLibreMap {
  getMap: () => MapLibreMap;
}
export type MapLibreRef = MutableRefObject<ExtendedMapLibreMap | null>;

// Main map: Explore feature

/**
 * Contains current state of map settings (set using MapFeatureExplorer)
 */
export type MapOptions = {
  [key in MapLayerOptionsType]?: boolean;
};

export type ExploreLayersData = {
  [key in MapLayerOptionsType]?: SingleExploreLayerConfig;
};

export type SingleExploreLayerConfig = {
  uuid: string;
  name: string;
  key: MapLayerOptionsType;
  description: string;
  earthEngineAssetId: string;
  visParams: VisParams;
  zoomConfig: LayerZoomConfig;
  tileUrl: string;
  googleEarthUrl: string;
  metadata: Record<never, never>;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type VisParams = {
  max: number;
  min: number;
  palette: string[];
};

export type LayerZoomConfig = {
  minZoom: number;
  maxZoom: number;
};

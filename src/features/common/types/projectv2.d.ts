import type {
  ConservationProjectExtended,
  ProjectSite,
  TreeProjectExtended,
} from '@planet-sdk/common';
import type {
  ProjectMapInfo,
  TreeProjectConcise,
  ConservationProjectConcise,
} from '@planet-sdk/common/build/types/project/map';
import type { MutableRefObject } from 'react';
import type { Map } from 'maplibre-gl';
import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from 'geojson';

export type MapProjectProperties =
  | TreeProjectConcise
  | ConservationProjectConcise;

export type ExtendedProject = TreeProjectExtended | ConservationProjectExtended;

export type MapProject = ProjectMapInfo<MapProjectProperties>;

export type MapRef = MutableRefObject<ExtendedMapLibreMap | null>;
export interface ExtendedMapLibreMap extends Map {
  getMap: () => Map;
}

export type DropdownType = 'site' | 'intervention' | null;

export type ProjectSiteFeature = Feature<Polygon | MultiPolygon, ProjectSite>;

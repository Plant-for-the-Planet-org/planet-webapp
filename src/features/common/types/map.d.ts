import type Supercluster from 'supercluster';
import type { ProjectSite, User } from '@planet-sdk/common';
import type { MutableRefObject } from 'react';
import type { UserPublicProfile } from '@planet-sdk/common';
import type { ContributionProps } from '../../user/RegisterTrees/RegisterTrees/SingleContribution';
import type { FlyToInterpolator } from 'react-map-gl';
import type { SetState } from './common';
import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from 'geojson';
import type { Map } from 'maplibre-gl';

export interface ClusterMarker {
  geometry: {
    coordinates: [number, number];
    type: 'Point';
  };
  id?: number;
  properties: {
    created?: number | Date | undefined;
    cluster: boolean;
    contributionType?: string;
    endDate?: undefined | number | Date;
    plantProject?: {
      country: string;
      guid: string;
      image: string;
      location: string | null;
      name: string;
      tpo: {
        guid: string;
        name: string;
      };
      unitType: string;
    };
    purpose?: string;
    quantity?: string;
    startDate?: undefined | number | Date;
    totalContributions?: number | undefined;
    cluster_id: number;
    point_count: number;
    point_count_abbreviated: number;
    totalTrees: number;
    quantity?: number;
    _type: string;
  };
  type: string;
}
export interface MarkerProps {
  geoJson: Cluster | ClusterMarker;
  mapRef: MutableRefObject<null>;
}

export interface ClusterMarkerProps {
  mapRef: MutableRefObject<null>;
  profile: User | UserPublicProfile;
}

export type Cluster =
  | Supercluster.PointFeature<any>
  | Supercluster.ClusterFeature<{
      totalTrees: number;
    }>;

export interface SingleMarkerProps {
  geoJson: Cluster | ClusterMarker;
  profile: User | UserPublicProfile;
}

export interface TestPointProps {
  quantity: string;
}

export interface TestClusterProps {
  totalTrees: string;
}

export interface CustomPopupMarkerProps {
  geoJson: Cluster | ClusterMarker;
  showPopUp: boolean;
  mapRef?: MutableRefObject<null>;
  profile?: User | UserPublicProfile;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}
export type Bound = [number, number, number, number];

export interface MyContributionsProps {
  profile: User | UserPublicProfile;
  token?: string | null;
}
export interface ViewState {
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  altitude: number;
  maxZoom: number;
  minZoom: number;
  maxPitch: number;
  minPitch: number;
  transitionDuration: number;
  transitionInterpolator: {
    propNames: ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'];
  };
  transitionInterruption: number;
}

export interface InteractionState {
  isDragging: boolean;
}

export interface ViewportProps {
  width?: string;
  height?: string;
  latitude: number;
  longitude: number;
  zoom: number;
  viewState?: ViewState | undefined;
  interactionState?: InteractionState | undefined;
}

export interface ViewportProps {
  height: number | string;
  width: number | string;
  zoom: [number] | number | undefined;
  latitude?: number;
  longitude?: number;
  center?: [number, number];
  transitionDuration?: number | undefined;
  transitionInterpolator?: FlyToInterpolator | undefined;
  transitionEasing?: (normalizedTime: number) => number;
}

export interface RegisteredTreesGeometry {
  features?: [];
  coordinates: [number, number] | number[][];
  type: 'Polygon' | 'Point';
}

export interface RegisterTreesFormProps {
  setContributionGUID: SetState<string>;
  setContributionDetails: SetState<ContributionProps | null>;
  setRegistered: SetState<boolean>;
}

// Map styling

export interface MapStyle {
  version: number;
  sprite: string;
  glyphs: string;
  sources: Sources;
  layers: Layer[];
  metadata: Metadata;
}

export type RequiredMapStyle = Omit<MapStyle, 'sprite', 'glyphs', 'metadata'>;

export interface Sources {
  esri: Esri;
}

export interface Esri {
  type: string;
  scheme: string;
  tilejson: string;
  format: string;
  maxzoom: number;
  tiles: string[];
  name: string;
}

export interface Layer {
  id: string;
  type: string;
  paint: Paint;
  layout: Layout;
  showProperties?: boolean;
  source?: string;
  'source-layer'?: string;
  minzoom?: number;
  maxzoom?: number;
  filter?: any[];
}

export interface Paint {
  'background-color'?: string;
  'fill-color': any;
  'fill-outline-color'?: string;
  'fill-pattern'?: string;
  'fill-opacity'?: number;
  'line-color': any;
  'line-width': any;
  'line-dasharray'?: number[];
  'text-color'?: string;
  'text-halo-color'?: string;
  'fill-translate'?: FillTranslate;
  'fill-translate-anchor'?: string;
  'line-opacity'?: number;
  'text-halo-blur'?: number;
  'text-halo-width'?: number;
}

export interface FillTranslate {
  stops: [number, number[]][];
}

export interface Layout {
  visibility?: string;
  'line-join'?: string;
  'line-cap'?: string;
  'symbol-placement'?: string;
  'symbol-avoid-edges'?: boolean;
  'icon-image'?: string;
  'symbol-spacing'?: number;
  'icon-rotation-alignment'?: string;
  'icon-allow-overlap'?: boolean;
  'icon-padding'?: number;
  'text-font'?: string[];
  'text-size': any;
  'text-letter-spacing': any;
  'text-line-height'?: number;
  'text-max-width'?: number;
  'text-field'?: string;
  'text-padding'?: number;
  'text-max-angle'?: number;
  'text-offset'?: number[];
  'text-rotation-alignment'?: string;
  'text-transform'?: string;
  'text-optional'?: boolean;
}

export interface Metadata {
  arcgisStyleUrl: string;
  arcgisOriginalItemTitle: string;
  arcgisQuickEditorWarning: boolean;
  arcgisQuickEditor: ArcgisQuickEditor;
  arcgisEditorExtents: ArcgisEditorExtent[];
  arcgisMinimapVisibility: boolean;
}

export interface ArcgisQuickEditor {
  labelTextColor: string;
  labelHaloColor: string;
  baseColor: string;
  spriteProcessing: boolean;
  labelContrast: number;
  labelColorMode: string;
  colorMode: string;
  colors: Colors;
  boundaries: string;
}

export interface Colors {
  boundaries: string;
}

export interface ArcgisEditorExtent {
  spatialReference: SpatialReference;
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

export interface SpatialReference {
  wkid: number;
  latestWkid?: number;
}

// Project site
export type ProjectSiteFeatureCollection = FeatureCollection<
  Polygon | MultiPolygon,
  ProjectSite | Record<string, never>
>;

export type ProjectSiteFeature = Feature<
  Polygon | MultiPolygon,
  ProjectSite | Record<string, never>
>;

// Map
export interface ExtendedMapLibreMap extends Map {
  getMap: () => Map;
}
export type MapLibreRef = MutableRefObject<ExtendedMapLibreMap | null>;

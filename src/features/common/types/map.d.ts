import { ViewportProps } from '../../user/ProfileV2/components/MyForestMap';
import Supercluster from 'supercluster';
import { User } from '@planet-sdk/common';
import { MutableRefObject } from 'react';
import { PublicUser } from './user';

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
}

export type Cluster =
  | Supercluster.PointFeature<any>
  | Supercluster.ClusterFeature<{
      totalTrees: number;
    }>;

export interface SingleMarkerProps {
  geoJson: Cluster | ClusterMarker;
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
}
export type Bound = [number, number, number, number];

export interface MyContributionsProps {
  profile: User | PublicUser;
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
  width: string;
  height: string;
  latitude: number;
  longitude: number;
  zoom: number;
  viewState?: ViewState | undefined;
  interactionState?: InteractionState | undefined;
}

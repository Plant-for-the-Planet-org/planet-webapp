import { ViewportProps } from 'react-map-gl';
import Supercluster, { PointFeature } from 'supercluster';
import { User } from '@planet-sdk/common';
import { Contributions } from './myForest';
import { MutableRefObject } from 'react';

interface ClusterMarker {
  geometry: {
    coordinates: [number, number]
    type: string
  };
  id: number;
  properties: {
    cluster: boolean;
    contributionType?: string;
    endDate?: undefined | number | Date;
    plantProject?: {
      country: string;
      guid: string;
      image: string;
      location: string | null;
      name: string;
      tpo : {
        guid : string;
        name: string;
      }
      unitType: string;
    };
    purpose?: string;
    quantity?: string;
    startDate?: undefined | number | Date;
    totalContribution?: number | undefined;
    cluster_id: number;
    point_count: number;
    point_count_abbreviated: number;
    totalTrees: number;
    quantity?: number
  };
  type: string
}
export interface MarkerProps {
   geoJson: Cluster | ClusterMarker
  }


 export  interface ClusterMarkerProps {
    viewport: ViewportProps;
    mapRef: MutableRefObject<null>;
  }

export type Cluster  = (
    | Supercluster.PointFeature<any>
    | Supercluster.ClusterFeature<{
        totalTrees: any;
      }>
  )


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
  showPopUp: boolean
}
export type Bound = [number, number, number, number]

export interface MyTreesProps {
    profile: User;
    authenticatedType: string;
    token?: string | null
  }
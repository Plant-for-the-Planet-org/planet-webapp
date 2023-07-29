import { ViewportProps } from 'react-map-gl';
import Supercluster from 'supercluster';
import { User } from '@planet-sdk/common';

export interface MarkerProps {
    totalTrees: number;
    coordinates: number[];
  }


 export  interface ClusterMarkerProps {
    viewport: ViewportProps;
    mapRef: null;
  }

export type Cluster  = (
    | Supercluster.PointFeature<any>
    | Supercluster.ClusterFeature<{
        totalTrees: any;
      }>
  )


export interface SingleMarkerProps {
    geoJson: Cluster
  }

  export interface TestPointProps {
    quantity: string;
  }

export interface TestClusterProps {
    totalTrees: string;
  }
  

export type Bound = [number, number, number, number]

export interface MyTreesProps {
    profile: User;
    authenticatedType: string;
  }
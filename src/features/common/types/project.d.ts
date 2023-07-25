import { FlyToInterpolator } from 'react-map-gl';
export interface Project {
  guid: string;
  slug: string;
  name: string;
  unitCost: number;
  currency: string;
  unit?: string;
  purpose: string;
  allowDonations: boolean;
}

export interface MapSingleProject {
  type: string;
  geometry: unknown;
  properties: {
    [index: string]: unknown;
    id: string;
    name: string;
    slug: string;
    allowDonations: boolean;
    purpose: string;
    currency: string;
    unitCost: number;
  };
}

export interface SingleProjectGeojson {
  geometry: Geometry;
  type: string;
  properties: Properties;
}

export interface Geometry {
  coordinates: number[][][];
  type: string;
}

export interface Properties {
  lastUpdated: LastUpdated;
  name: string;
  description: string;
  id: string;
  status: string;
}

export interface LastUpdated {
  date: string;
  timezone: string;
  timezone_type: number;
}

export interface ViewPort {
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  zoom: number;
  transitionDuration?: number;
  transitionInterpolator?: FlyToInterpolator;
  transitionEasing?: number;
}

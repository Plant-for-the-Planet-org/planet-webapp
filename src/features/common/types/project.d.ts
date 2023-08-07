export interface ProjectOption {
  guid: string;
  slug: string;
  name: string;
  unitCost: number;
  currency: string;
  unit?: string;
  purpose: string;
  allowDonations: boolean;
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

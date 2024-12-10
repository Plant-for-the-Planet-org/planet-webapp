import type { DateString } from '../../common/types/common';

export interface DeviceLocation {
  coordinates: number[];
  type: string;
}

export interface App {
  appVersion: string;
  deviceSystemName: string;
  deviceSystemVersion: string;
  deviceModel: string;
  deviceManufacturer: string;
  deviceBrand: string;
  deviceLocation: DeviceLocation;
}

export interface Metadata {
  app: App;
  public: any[];
}

export interface Coordinate {
  image: string;
  coordinateIndex: string;
  id: string;
  status: string;
}

export interface OriginalGeometry {
  coordinates: number[];
  type: string;
}

export interface Geometry {
  coordinates: number[];
  type: string;
}

export interface Measurements {
  width: number;
  height: number;
}

export interface SamplePlantLocation {
  parent: string;
  metadata: Metadata;
  hid: string;
  scientificName: string;
  idempotencyKey: string;
  profile: string;
  coordinates: Coordinate[];
  scientificSpecies: string;
  geometryUpdatesCount: number;
  type: string;
  plantProjectSite?: string | null;
  registrationDate: string;
  originalGeometry: OriginalGeometry;
  captureMode: string;
  geometry: Geometry;
  id: string;
  tag: string;
  captureStatus: string;
  plantDate: string;
  deviceLocation: DeviceLocation;
  measurements: Measurements;
}

export interface PlantedSpecies {
  scientificName: string;
  created: string;
  otherSpecies?: string | null;
  scientificSpecies: string;
  treeCount: number;
  id: string;
  updated: string;
}

export interface PlantLocation {
  metadata: Metadata;
  hid: string;
  idempotencyKey: string;
  coordinates: Coordinate[];
  geometryUpdatesCount: number;
  type: string;
  plantProjectSite?: string | null;
  samplePlantLocations: SamplePlantLocation[];
  plantProject: string;
  plantedSpecies: PlantedSpecies[];
  plantDateEnd?: DateString | null;
  plantDateStart?: DateString | null;
  registrationDate: string;
  originalGeometry: OriginalGeometry;
  sampleTreeCount: number;
  captureMode: string;
  geometry: Geometry;
  id: string;
  captureStatus: string;
  plantDate: string;
  deviceLocation: DeviceLocation;
}

export interface PlantingLocationFormData {
  plantDate: string;
  plantProject: string;
  geometry: {};
  plantedSpecies: SpeciesFormData[];
}

export interface SpeciesFormData {
  otherSpecies: string;
  treeCount: number;
}

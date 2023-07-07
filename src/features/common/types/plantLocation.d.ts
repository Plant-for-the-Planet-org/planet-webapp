export interface PlantLocation {
  nextMeasurementDate: any;
  metadata: Metadata;
  hid: string;
  otherSpecies: any;
  description: any;
  geometryUpdatesCount: number;
  type: string;
  plantProjectSite: any;
  statusReason: any;
  plantDateEnd: any;
  registrationDate: string;
  sampleTreeCount: number;
  id: string;
  plantDate: string;
  image: any;
  idempotencyKey: string;
  coordinates: Coordinate[];
  history: any[];
  samplePlantLocations: SamplePlantLocation[];
  plantProject: string;
  plantedSpecies: PlantedSpecy[];
  plantDateStart: any;
  originalGeometry: OriginalGeometry2;
  captureMode: string;
  geometry: Geometry2;
  captureStatus: string;
  deviceLocation: DeviceLocation4;
  status: any;
}

export interface Metadata {
  app: App;
  public: any[];
}

export interface App {
  appVersion: string;
  deviceSystemName: string;
  deviceSystemVersion: string;
  deviceModel: string;
  deviceManufacturer: string;
  deviceBrand: string;
  deviceLocation: DeviceLocation;
  registrationDate?: string;
}

export interface DeviceLocation {
  coordinates: number[];
  type: string;
}

export interface Coordinate {
  image?: string;
  coordinateIndex: string;
  id: string;
  status: string;
}

export interface SamplePlantLocation {
  parent: string;
  nextMeasurementDate: any;
  metadata: Metadata2;
  hid: string;
  scientificName?: string;
  otherSpecies: any;
  description: any;
  geometryUpdatesCount: number;
  type: string;
  plantProjectSite: any;
  statusReason: any;
  registrationDate: string;
  id: string;
  tag: any;
  plantDate: string;
  measurements: Measurements;
  image: any;
  idempotencyKey: string;
  profile: string;
  coordinates: Coordinate2[];
  scientificSpecies?: string;
  history: History[];
  originalGeometry: OriginalGeometry;
  captureMode: string;
  geometry: Geometry;
  lastMeasurementDate: LastMeasurementDate;
  captureStatus: string;
  deviceLocation: DeviceLocation3;
  status: any;
}

export interface Metadata2 {
  app?: App2;
  private: any;
  public: any[];
}

export interface App2 {
  appVersion: string;
  deviceSystemName: string;
  deviceSystemVersion: string;
  deviceModel: string;
  deviceManufacturer: string;
  deviceBrand: string;
  deviceLocation: DeviceLocation2;
}

export interface DeviceLocation2 {
  coordinates: number[];
  type: string;
}

export interface Measurements {
  width: number;
  height: number;
}

export interface Coordinate2 {
  image?: string;
  created: string;
  coordinateIndex: string;
  id: string;
  updated: string;
  status: string;
}

export interface History {
  image?: string;
  statusReason: any;
  created: string;
  eventName: string;
  classification: any;
  eventDate: EventDate;
  measurements: Measurements2;
  status?: string;
}

export interface EventDate {
  date: string;
  timezone: string;
  timezone_type: number;
}

export interface Measurements2 {
  width: number;
  height: number;
}

export interface OriginalGeometry {
  coordinates: number[];
  type: string;
}

export interface Geometry {
  coordinates: number[];
  type: string;
}

export interface LastMeasurementDate {
  date: string;
  timezone: string;
  timezone_type: number;
}

export interface DeviceLocation3 {
  coordinates: number[];
  type: string;
}

export interface PlantedSpecy {
  scientificName?: string;
  created: string;
  otherSpecies?: string;
  scientificSpecies?: string;
  treeCount: number;
  id: string;
  updated: string;
}

export interface OriginalGeometry2 {
  coordinates: number[][][];
  type: string;
}

export interface Geometry2 {
  coordinates: number[][][];
  type: string;
}

export interface DeviceLocation4 {
  coordinates: number[];
  type: string;
}

import { DateString } from './common';
import { Links } from './payments';
import { Polygon, Point } from 'geojson';

export interface Geometry {
  coordinates: number[][][];
  type: string;
  properties: Properties;
}
export interface GeometryOfSinglePlant {
  coordinates: number[];
  type: string;
  properties: Properties;
}

export interface Properties {
  id: string;
}

export interface PlantLocationBase {
  hid: string;
  id: string;
  idempotencyKey: string;
  plantProject: string;
  metadata: Metadata;
  registrationDate: DateString;
  plantDate: DateString;
  coordinates: PlantLocationCoordinate[];
  history: History[];
  captureMode: CaptureMode;
  captureStatus: CaptureStatus;
  deviceLocation: DeviceLocation;
  otherSpecies: string | null;
  description: string | null;
  geometryUpdatesCount: number;
  plantProjectSite: string | null;
  image: string | null; //deprecate if not being used?
  status: string | null; // currently always null. Should we do something here?
  statusReason: string | null; // currently always null. Should we do something here?
}
export interface PlantLocationSingle extends PlantLocationBase {
  type: 'single';
  scientificName: string | null;
  scientificSpecies: string | null;
  tag: string | null;
  measurements: Measurements;
  originalGeometry: Point;
  geometry: Point;
  sampleTrees: SamplePlantLocation[];
}

export interface PlantLocationMulti extends PlantLocationBase {
  type: 'multi';
  nextMeasurementDate: DateString | null;
  plantDateStart: DateString | null;
  plantDateEnd: DateString | null;
  sampleTreeCount: number;
  samplePlantLocations: SamplePlantLocation[];
  plantedSpecies: PlantedSpecies[];
  originalGeometry: Polygon;
  geometry: Point | Polygon;
  sampleTrees: SamplePlantLocation[];
}

export type PlantLocation = PlantLocationSingle | PlantLocationMulti;

export interface SamplePlantLocation
  extends Omit<PlantLocationBase, 'plantProject'> {
  type: 'sample';
  /** parent plant location */
  parent: string;
  /** tpo profile id */
  profile: string;
  nextMeasurementDate: DateString | null;
  lastMeasurementDate: LastMeasurementDate;
  scientificName: string;
  scientificSpecies: string;
  tag: string | null;
  measurements: Measurements;
  originalGeometry: Point;
  geometry: Point;
  sampleTrees?: PlantLocation[];
}

export interface Metadata {
  app: App;
  public: unknown[];
  private?: unknown[];
}

export interface App {
  [key: string]: unknown;
}

export interface DeviceLocation {
  coordinates: number[];
  type: string;
}

type PlantLocationType = 'single' | 'multi' | 'sample';

export interface PlantLocationCoordinate {
  image?: string;
  created: DateString;
  coordinateIndex: string;
  id: string;
  updated: DateString;
  status: string;
}

export interface Measurements {
  width: number;
  height: number;
}

export interface History {
  image?: string;
  statusReason: string | null; //TODO - update with possible values
  created: DateString;
  eventName: HistoryEvent;
  classification: string | null; //TODO - update with possible values
  eventDate: EventDate;
  measurements: Measurements;
  status: TreeStatus | null;
}

export interface EventDate {
  date: DateString;
  timezone: string;
  timezone_type: number;
}

export interface PlantedSpecies {
  scientificName?: string;
  created: string;
  otherSpecies?: string;
  scientificSpecies?: string;
  treeCount: number;
  id: string;
  updated: DateString;
}

type TreeStatus = 'alive' | 'sick' | 'dead';

type CaptureMode = 'off-site' | 'on-site';

type CaptureStatus = 'partial' | 'complete';

type HistoryEvent = 'created' | 'measurement' | 'skip-measurement' | 'status';

export interface LastMeasurementDate {
  date: DateString;
  timezone: string;
  timezone_type: number;
}

export interface Species {
  aliases: string;
  description: string | null;
  id: string;
  image: string | null;
  scientificName: string;
  scientificSpecies: string;
}

interface Filters {
  all: string;
  'location-partial': string;
  'location-complete': string;
  'location-single': string;
  'location-multi': string;
  'location-sample': string;
  'revision-pending': string;
}

export interface ExtendedScopePlantLocations {
  items: PlantLocation[] | SamplePlantLocation[];
  total: number;
  count: number;
  _links: Links;
  _filters: Filters;
}
export interface SpeciesSuggestionType {
  id: string;
  name: string;
  scientificName: string;
}

export type SampleTree = {
  plantingDate: Date;
  treeTag: string;
  height: string;
  diameter: string;
  otherSpecies: string;
  latitude: string;
  longitude: string;
};

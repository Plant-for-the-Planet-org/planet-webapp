import { DateString } from './common';
import { Links } from './payments';
import { Polygon, Point } from 'geojson';

export interface PlantLocationBase {
  hid: string;
  id: string;
  idempotencyKey: string;
  plantProject: string;
  metadata: Metadata;
  registrationDate: DateString;
  /** @deprecated */
  plantDate: DateString;
  interventionDate: DateString;
  interventionStartDate: DateString | null; //should be the same as interventionDate
  interventionEndDate: DateString | null;
  lastMeasurementDate: DateString | null;
  nextMeasurementDate: DateString | null; //only relevant for single and sample plant locations for now
  coordinates: PlantLocationCoordinate[];
  history: History[];
  captureMode: CaptureMode;
  captureStatus: CaptureStatus;
  deviceLocation: Point;
  otherSpecies: string | null;
  description: string | null;
  geometryUpdatesCount: number;
  plantProjectSite: string | null;
  image: string | null;
  status: InterventionStatus | null;
  statusReason: InterventionStatusReasons | null;
}

export interface PlantLocationSingle extends PlantLocationBase {
  type: 'single-tree-registration';
  scientificName: string | null;
  scientificSpecies: string | null;
  tag: string | null;
  measurements: Measurements;
  originalGeometry: Point;
  geometry: Point;
}

export interface PlantLocationMulti extends PlantLocationBase {
  type: 'multi-tree-registration';
  nextMeasurementDate: DateString | null;
  sampleTreeCount: number;
  sampleInterventions: SamplePlantLocation[];
  plantedSpecies: PlantedSpecies[];
  originalGeometry: Polygon;
  geometry: Point | Polygon;
  measurements: null;
  nextMeasurementDate: null;
}

export type PlantLocation = PlantLocationSingle | PlantLocationMulti;

export interface SamplePlantLocation extends PlantLocationBase {
  type: 'sample-tree-registration';
  // /** parent plant location */
  parent: string;
  // /** tpo profile id */
  profile: string;
  scientificName: string;
  scientificSpecies: string;
  tag: string | null;
  measurements: Measurements;
  originalGeometry: Point;
  geometry: Point;
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

export interface PlantLocationCoordinate {
  image?: string;
  coordinateIndex: string;
  id: string;
  status: string;
  created: DateString;
  updated: DateString;
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

type CaptureMode = 'off-site' | 'on-site' | 'external';

type CaptureStatus = 'partial' | 'complete';

type HistoryEvent = 'created' | 'measurement' | 'skip-measurement' | 'status';

type InterventionStatus = 'dead' | 'alive';

type InterventionStatusReasons = 'flood' | 'fire' | 'drought' | 'other';

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

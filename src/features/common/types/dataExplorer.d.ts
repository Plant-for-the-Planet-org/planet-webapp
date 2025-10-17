import type { Point, Polygon } from 'geojson';

export interface IDailyFrame {
  plantedDate: string;
  treesPlanted: number;
}

export interface IWeeklyFrame {
  weekStartDate: string;
  weekEndDate: string;
  weekNum: number;
  month: string;
  year: number;
  treesPlanted: number;
}

export interface IMonthlyFrame {
  month: string;
  year: number;
  treesPlanted: number;
}

export interface IYearlyFrame {
  year: number;
  treesPlanted: number;
}

export interface ISpeciesPlanted {
  other_species: null | string;
  scientific_species_id: number;
  name: null | string;
  total_tree_count: number;
}

export interface IExportData {
  hid: string;
  plant_date: Date;
  species: string;
  tree_count: number;
  geometry: string;
  type: string;
  trees_allocated: number;
  trees_planted: number;
  metadata: string;
  description: null;
  plant_project_id: number;
  sample_tree_count: number;
  capture_status: string;
  created: Date;
}

export interface TotalTreesPlanted {
  totalTreesPlanted: number;
}

export interface TotalSpeciesPlanted {
  totalSpeciesPlanted: number;
}

export interface Feature {
  geometry: Point | Polygon;
  properties: {
    name: string;
  };
  type: 'Feature';
}

export type FeatureCollection = {
  type: 'FeatureCollection';
  features: Feature[];
};

export interface UncleanSite {
  name: string;
  geometry: Point | Polygon;
}

export interface UncleanDistinctSpecies {
  name: string;
}

export type DistinctSpecies = string[];

export interface DataExplorerInterventionFeature {
  geometry: Point | Polygon;
  properties: {
    guid: string;
    treeCount: number;
    density: number;
    opacity?: number;
  };
  type: 'Feature';
}

export interface InterventionFeatureCollection {
  type: 'FeatureCollection';
  features: DataExplorerInterventionFeature[];
}

// --- /api/data-explorer/map/intervention/[interventionGuid]
export interface Measurements {
  width: string;
  height: string;
}

export interface SampleIntervention {
  tag: string | null;
  guid: string;
  geometry: Point;
  measurements: Measurements;
}

export interface PlantedSpecies {
  treeCount: number;
  scientificName: string;
}

export interface InterventionDetailsQueryRes {
  result: InterventionDetails;
}

export interface InterventionProperties {
  hid: string;
  type: 'single-tree-registration' | 'multi-tree-registration';
}

export interface InterventionDetails {
  properties: InterventionProperties;
  plantedSpecies: PlantedSpecies[];
  totalPlantedTrees: number;
  sampleInterventions: null | SampleIntervention[];
  totalSampleInterventions: null | number;
}

// --- types for InterventionDetailsApi ------

export interface InterventionDetailsApiResponse {
  res: {
    properties: InterventionProperties;
    plantedSpecies: {
      treeCount: number;
      scientificName: string;
    }[];
    totalPlantedTrees: number;
    sampleInterventions:
      | null
      | {
          tag: string;
          guid: string;
          species: string;
          geometry: {
            type: string;
            coordinates: number[];
          };
          measurements: {
            width: string;
            height: string;
          };
        }[];
    totalSampleInterventions: null | number;
  };
}

export interface SingleInterventionApiResponse {
  geometry: Point | Polygon;
  properties: {
    guid: string;
    treeCount: number;
  };
  type: 'Feature';
}

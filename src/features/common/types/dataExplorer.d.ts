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

export interface UncleanPlantLocations {
  geometry: string;
  guid: string;
}

export interface PlantLocation {
  geometry: Point | Polygon;
  properties: {
    guid: string;
    treeCount: number;
    density: number;
    opacity?: number;
  };
  type: 'Feature';
}

export interface PlantLocations {
  type: 'FeatureCollection';
  features: PlantLocation[];
}

// --- /api/data-explorer/map/plant-location/[plantLocationId]
export interface Measurements {
  width: string;
  height: string;
}

export interface SamplePlantLocation {
  tag: string | null;
  guid: string;
  geometry: Point;
  measurements: Measurements;
}

export interface PlantedSpecies {
  treeCount: number;
  scientificName: string;
}

export interface PlantLocationDetailsQueryRes {
  result: PlantLocationDetails;
}

export interface PlantLocationProperties {
  hid: string;
  type: 'single-tree-registration' | 'multi-tree-registration';
}

export interface PlantLocationDetails {
  properties: PlantLocationProperties;
  plantedSpecies: PlantedSpecies[];
  totalPlantedTrees: number;
  samplePlantLocations: null | SamplePlantLocation[];
  totalSamplePlantLocations: null | number;
}

// --- types for plantLocationDetailsApi ------

export interface PlantLocationDetailsApiResponse {
  res: {
    properties: PlantLocationProperties;
    plantedSpecies: {
      treeCount: number;
      scientificName: string;
    }[];
    totalPlantedTrees: number;
    samplePlantLocations:
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
    totalSamplePlantLocations: null | number;
  };
}

export interface SinglePlantLocationApiResponse {
  geometry: Point | Polygon;
  properties: {
    guid: string;
    treeCount: number;
  };
  type: 'Feature';
}

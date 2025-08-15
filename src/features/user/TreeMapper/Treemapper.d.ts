export interface PlantedSpecies {
  scientificName: string;
  created: string;
  otherSpecies?: string | null;
  scientificSpecies: string;
  treeCount: number;
  id: string;
  updated: string;
}

export interface InterventionFormData {
  plantDate: string;
  plantProject: string;
  geometry: {};
  plantedSpecies: SpeciesFormData[];
}

export interface SpeciesFormData {
  otherSpecies: string;
  treeCount: number;
}

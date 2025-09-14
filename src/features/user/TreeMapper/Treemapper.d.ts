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

export interface Species {
  aliases: string;
  description: string | null;
  id: string;
  image: string | null;
  scientificName: string;
  scientificSpecies: string;
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

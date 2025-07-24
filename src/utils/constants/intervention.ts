import type { DataDrivenPropertyValueSpecification } from 'maplibre-gl';
import type { Intervention } from '../../features/common/types/intervention';
import type { InterventionTypes } from '@planet-sdk/common';

const SINGLE_TREE = '#007A49';
const MULTI_TREE = '#007A49';
const INVASIVE_SPECIES = '#EB5757';
const FIRE_SUPPRESSION = '#F2C94C';
const FIRE_PATROL = '#F2994A';
const FENCING = '#48AADD';
const MARKING_REGENERANT = '#27AE60';
const LIBERATING_REGENERANT = '#56CCF2';
const GRASS_SUPPRESSION = '#219653';
const FIREBREAKS = '#E86F56';
const SEED_RAIN = '#2F80ED';
const SOIL_IMPROVEMENT = '#6D4230';
const STOP_HARVESTING = '#4F4F4F';
const DIRECT_SEEDING = '#6FCF97';
const ENRICHMENT_PLANTING = '#EB67CE';
const MAINTENANCE = '#6C63FF';
const OTHER_INTERVENTION = '#9B51E0';

/**
 * MapLibre GL color configuration for visualizing forest interventions.
 * Uses a match expression: ['match', ['get', 'type'], ...interventionPairs, defaultColor]
 * where interventionPairs are 'intervention-type': 'color' pairs (e.g., 'single-tree': '#007A49')
 * Related activities share similar colors (e.g., fire management uses warm colors,
 * planting uses greens). Defaults to Single Tree color (#007A49) if no match found.
 */
// prettier-ignore
export const FillColor: DataDrivenPropertyValueSpecification<string> = [
	'match',
	['get', 'type'],
	'remeasurement', 'tomato',
	'single-tree-registration', SINGLE_TREE,
	'multi-tree-registration', MULTI_TREE,
	'removal-invasive-species', INVASIVE_SPECIES,
	'fire-suppression', FIRE_SUPPRESSION,
	'fire-patrol', FIRE_PATROL,
	'fencing', FENCING,
	'marking-regenerant', MARKING_REGENERANT,
	'liberating-regenerant', LIBERATING_REGENERANT,
	'grass-suppression', GRASS_SUPPRESSION,
	'firebreaks', FIREBREAKS,
	'assisting-seed-rain', SEED_RAIN,
	'soil-improvement', SOIL_IMPROVEMENT,
	'stop-tree-harvesting', STOP_HARVESTING,
	'direct-seeding', DIRECT_SEEDING,
	'enrichment-planting', ENRICHMENT_PLANTING,
	'other-intervention', OTHER_INTERVENTION,
	'maintenance', MAINTENANCE,
	SINGLE_TREE
];

export type INTERVENTION_TYPE = InterventionTypes | 'default' | 'all';

export const AllInterventions: Array<{
  label: string;
  value: INTERVENTION_TYPE;
  index: number;
}> = [
  {
    label: 'All Intervention',
    value: 'all',
    index: 0,
  },
  {
    label: 'Single/Multi Tree Plantation',
    value: 'default',
    index: 1,
  },
  {
    label: 'Single Tree Plantation',
    value: 'single-tree-registration',
    index: 2,
  },
  {
    label: 'Multi Tree Plantation',
    value: 'multi-tree-registration',
    index: 3,
  },
  { label: 'Fire Patrol', value: 'fire-patrol', index: 4 },
  { label: 'Fire Suppression Team', value: 'fire-suppression', index: 5 },
  { label: 'Establish Fire Breaks', value: 'firebreaks', index: 6 },
  { label: 'Fencing', value: 'fencing', index: 7 },
  {
    label: 'Removal of Invasive Species',
    value: 'removal-invasive-species',
    index: 8,
  },
  { label: 'Direct Seeding', value: 'direct-seeding', index: 9 },
  { label: 'Grass Suppression', value: 'grass-suppression', index: 10 },
  { label: 'Marking Regenerant', value: 'marking-regenerant', index: 11 },
  { label: 'Enrichment Planting', value: 'enrichment-planting', index: 12 },
  { label: 'Liberating Regenerant', value: 'liberating-regenerant', index: 13 },
  { label: 'Soil Improvement', value: 'soil-improvement', index: 14 },
  { label: 'Assisting Seed Rain', value: 'assisting-seed-rain', index: 15 },
  { label: 'Stop Tree Harvesting', value: 'stop-tree-harvesting', index: 16 },
  { label: 'Maintenance', value: 'maintenance', index: 17 },
  { label: 'Other Intervention', value: 'other-intervention', index: 18 },
];

export const PLANTATION_TYPES = [
  'multi-tree-registration',
  'single-tree-registration',
];

// Helper function with proper type checking
export const isNonPlantationType = (
  plantLocation: Intervention | null
): boolean => {
  return (
    plantLocation !== null && !PLANTATION_TYPES.includes(plantLocation.type)
  );
};

export const findMatchingIntervention = (value: string) => {
  return AllInterventions.find((item) => item.value === value);
};

export const findInterventionHeader = (valueKey: string | undefined) => {
  const found = AllInterventions.find((item) => item.value === valueKey);
  return found ? found.label : '';
};

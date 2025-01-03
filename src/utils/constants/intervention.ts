import { DataDrivenPropertyValueSpecification } from "maplibre-gl";
import { PlantLocation, PlantLocationMulti } from "../../features/common/types/plantLocation";

export const SINGLE_TREE = '#007A49';
export const MULTI_TREE = '#007A49';
export const INVASIVE_SPECIES = '#EB5757';
export const FIRE_SUPPRESSION = '#F2C94C';
export const FIRE_PATROL = '#F2994A';
export const FENCING = '#48AADD';
export const MARKING_REGENERANT = '#27AE60';
export const LIBERATING_REGENERANT = '#56CCF2';
export const GRASS_SUPPRESSION = '#219653';
export const FIREBREAKS = '#E86F56';
export const SEED_RAIN = '#2F80ED';
export const SOIL_IMPROVEMENT = '#6D4230';
export const STOP_HARVESTING = '#4F4F4F';
export const DIRECT_SEEDING = '#6FCF97';
export const ENRICHMENT_PLANTING = '#EB67CE';
export const MAINTENANCE = '#6C63FF';
export const OTHER_INTERVENTION = '#9B51E0';

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
]
export type INTERVENTION_TYPE = 'single-tree-registration' | 'multi-tree-registration' | 'removal-invasive-species' | 'fire-suppression' | 'fire-patrol' | 'fencing' | 'marking-regenerant' | 'liberating-regenerant' | 'grass-suppression' | 'firebreaks' | 'assisting-seed-rain' | 'soil-improvement' | 'stop-tree-harvesting' | 'direct-seeding' | 'enrichment-planting' | 'other-intervention' | 'maintenance' | 'unknown' | 'default' | 'all'


export const AllIntervention: Array<{
    label: string
    value: INTERVENTION_TYPE
    index: number
}> = [
        {
            label: 'All Intervention',
            value: 'all',
            index: 0,
        },
        {
            label: 'Single/Multi Tree Plantation',
            value: 'default',
            index: 0,
        },
        {
            label: 'Single Tree Plantation',
            value: 'single-tree-registration',
            index: 0,
        },
        { label: 'Multi Tree Plantation', value: 'multi-tree-registration', index: 0 },
        { label: 'Fire Patrol', value: 'fire-patrol', index: 0 },
        { label: 'Fire Suppression Team', value: 'fire-suppression', index: 0 },
        { label: 'Establish Fire Breaks', value: 'firebreaks', index: 0 },
        { label: 'Fencing', value: 'fencing', index: 0 },
        {
            label: 'Removal of Invasive Species',
            value: 'removal-invasive-species',
            index: 0,
        },
        { label: 'Direct Seeding', value: 'direct-seeding', index: 0 },
        { label: 'Grass Suppression', value: 'grass-suppression', index: 0 },
        { label: 'Marking Regenerant', value: 'marking-regenerant', index: 0 },
        { label: 'Enrichment Planting', value: 'enrichment-planting', index: 0 },
        { label: 'Liberating Regenerant', value: 'liberating-regenerant', index: 0 },
        { label: 'Soil Improvement', value: 'soil-improvement', index: 0 },
        { label: 'Assisting Seed Rain', value: 'assisting-seed-rain', index: 0 },
        { label: 'Stop Tree Harvesting', value: 'stop-tree-harvesting', index: 0 },
        { label: 'Maintenance', value: 'maintenance', index: 0 },
        { label: 'Other Intervention', value: 'other-intervention', index: 0 }
    ]

export const PLANTATION_TYPES = ['multi-tree-registration', 'single-tree-registration']

// Helper function with proper type checking
export const isNonPlantationType = (location: PlantLocation | null): boolean => {
    return location !== null && !PLANTATION_TYPES.includes(location.type);
};


export const findMatchingIntervention = (value: string) => {
    return AllIntervention.find(item => item.value === value);
};

export const isPlantLocationMulti = (location: PlantLocation | null): location is PlantLocationMulti => {
    return location !== null && 
      'sampleTreeCount' in location && 
      'sampleInterventions' in location && 
      'plantedSpecies' in location;
  };
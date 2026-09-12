import type { QuestionnaireFieldColumn } from '../../../common/types/project';

// Mirrors the `listSpecies` field in treecounter-platform `src/Service/ProjectQuestionnaire/Schema/V1/RestorationQuestionnaireSchemaV1.php`, schema v1.
export const listSpeciesColumns: QuestionnaireFieldColumn[] = [
  {
    key: 'scientificName',
    label: 'Scientific name',
    type: 'species',
  },
  {
    key: 'percentage',
    label: 'Approximate % of total trees planted',
    type: 'percentage',
  },
  {
    key: 'origin',
    label: 'Origin of species',
    type: 'choice',
    choices: ['native', 'non-native', 'introduced', 'naturalized'],
  },
];

export const listSpeciesMinRows = 5;

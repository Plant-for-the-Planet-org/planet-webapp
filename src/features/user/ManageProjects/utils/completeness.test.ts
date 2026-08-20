import type { QuestionnaireFieldSchema } from '../../../common/types/project';

import type { ExtendedProfileProjectProperties } from '../../../common/types/project';

import { describe, expect, it } from 'vitest';
import {
  getDetailedAnalysisMissing,
  getQuestionnaireMissing,
  isQuestionnaireFieldRequired,
} from './completeness';

const textField = (
  overrides: Partial<QuestionnaireFieldSchema> = {}
): QuestionnaireFieldSchema => ({
  type: 'text',
  label: 'Cost composition explanation',
  description: null,
  classifications: null,
  ...overrides,
});

describe('isQuestionnaireFieldRequired', () => {
  it('treats a field without the flag as required', () => {
    expect(isQuestionnaireFieldRequired(textField())).toBe(true);
  });

  it('treats optional: false as required', () => {
    expect(isQuestionnaireFieldRequired(textField({ optional: false }))).toBe(
      true
    );
  });

  it('honours optional: true from the schema', () => {
    expect(isQuestionnaireFieldRequired(textField({ optional: true }))).toBe(
      false
    );
  });

  it('makes an annotated optional field required again', () => {
    expect(
      isQuestionnaireFieldRequired(textField({ optional: true }), 'Please add')
    ).toBe(true);
  });
});

describe('getQuestionnaireMissing', () => {
  const fields: [string, QuestionnaireFieldSchema][] = [
    ['projectGoals', textField({ label: 'Project Goals' })],
    [
      'priceCompositionExplanation',
      textField({ label: 'Cost composition explanation', optional: true }),
    ],
  ];

  it('lists only blank required fields', () => {
    expect(getQuestionnaireMissing(fields, {})).toEqual([
      { key: 'projectGoals', label: 'Project Goals' },
    ]);
  });

  it('is empty once every required field is answered', () => {
    expect(getQuestionnaireMissing(fields, { projectGoals: 'done' })).toEqual(
      []
    );
  });

  it('pulls in an optional field a reviewer asked about', () => {
    expect(
      getQuestionnaireMissing(
        fields,
        { projectGoals: 'done' },
        { 'questionnaire.priceCompositionExplanation': 'Please explain' }
      )
    ).toEqual([
      {
        key: 'priceCompositionExplanation',
        label: 'Cost composition explanation',
      },
    ]);
  });

  it('keeps an already-answered required field listed once a reviewer annotates it', () => {
    expect(
      getQuestionnaireMissing(
        fields,
        { projectGoals: 'a description written before review' },
        { 'questionnaire.projectGoals': 'Please clarify the timeline' }
      )
    ).toEqual([{ key: 'projectGoals', label: 'Project Goals' }]);
  });
});

describe('getDetailedAnalysisMissing', () => {
  const baseDetails = {
    purpose: 'conservation',
    metadata: {
      areaProtected: '10',
      startingProtectionYear: '2020',
      ecosystem: 'wetland',
      ownershipType: 'private',
      landOwnershipType: ['individual'],
      actions: 'patrols',
      mainChallenge: 'poaching',
      motivation: 'protect habitat',
      siteOwnerName: 'Jane Doe',
      benefits: 'more biodiversity',
    },
  } as unknown as ExtendedProfileProjectProperties;

  const t = (key: string) => key;

  it('is empty once every required field is answered', () => {
    expect(getDetailedAnalysisMissing(baseDetails, t)).toEqual([]);
  });

  it('keeps an already-answered required field listed once a reviewer annotates it', () => {
    expect(
      getDetailedAnalysisMissing(baseDetails, t, {
        'metadata.mainChallenge': 'Please give more detail',
      })
    ).toEqual([{ key: 'mainChallenge', label: 'mainChallenge' }]);
  });

  it('pulls in the optional benefits field a reviewer asked about', () => {
    expect(
      getDetailedAnalysisMissing(baseDetails, t, {
        'metadata.benefits': 'Please expand on this',
      })
    ).toEqual([{ key: 'benefits', label: 'conservationImpacts' }]);
  });
});

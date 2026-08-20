import type { QuestionnaireFieldSchema } from '../../../common/types/project';

import { describe, expect, it } from 'vitest';
import {
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

  it('does not re-list an already-answered field just because a reviewer commented on it', () => {
    // A comment on a filled field is a request to revise it, not proof it is
    // blank. Nothing clears the annotation client-side, so counting it as
    // missing would block resubmission forever.
    expect(
      getQuestionnaireMissing(
        fields,
        { projectGoals: 'a description written before review' },
        { 'questionnaire.projectGoals': 'Please clarify the timeline' }
      )
    ).toEqual([]);
  });
});

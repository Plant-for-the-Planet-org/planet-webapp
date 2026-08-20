import type {
  ExtendedProfileProjectProperties,
  MissingField,
  QuestionnaireFieldSchema,
} from '../../../common/types/project';

/** DOM id put on a form field so a jump link can target it. */
export function fieldAnchorId(key: string): string {
  return `field-${key}`;
}

/**
 * Optional fields exist so the user can supply extra data when a reviewer asks
 * for it. The schema marks them with `optional`. An annotation overrides that:
 * once a reviewer has asked for the value, it has to be given before the
 * project can go back for review.
 */
export function isQuestionnaireFieldRequired(
  field: QuestionnaireFieldSchema,
  annotation?: string
): boolean {
  if (annotation) return true;
  return field.optional !== true;
}

/** Returns true when the given field value counts as "filled" (at least one cell non-empty). */
export function isFieldFilled(
  field: QuestionnaireFieldSchema,
  val: unknown
): boolean {
  if (field.type === 'multi_choice')
    return Array.isArray(val) && val.length > 0;

  if (field.type === 'row_list') {
    if (!val || typeof val !== 'object') return false;
    return Object.values(val as Record<string, unknown>).some(
      (v) => v !== '' && v !== null && v !== undefined
    );
  }

  if (field.type === 'species_list') {
    if (!Array.isArray(val)) return false;
    // A row of only blanks does not count, so padding rows never mark the
    // field complete.
    return val.some(
      (row) =>
        typeof row === 'object' &&
        row !== null &&
        Object.values(row as Record<string, unknown>).some(
          (v) => v !== '' && v !== null && v !== undefined
        )
    );
  }

  if (field.type === 'matrix') {
    if (!val || typeof val !== 'object') return false;
    return Object.values(val as Record<string, unknown>).some(
      (r) =>
        typeof r === 'object' &&
        r !== null &&
        Object.values(r as Record<string, unknown>).some(
          (v) => v !== '' && v !== null && v !== undefined
        )
    );
  }

  return val !== undefined && val !== '' && val !== null;
}

/** Every required questionnaire field still left blank, in the order it is rendered. */
export function getQuestionnaireMissing(
  visibleFields: [string, QuestionnaireFieldSchema][],
  values: Record<string, unknown>,
  annotations: Record<string, string> = {}
): MissingField[] {
  const missing: MissingField[] = [];
  for (const [name, field] of visibleFields) {
    const annotation = annotations[`questionnaire.${name}`];
    if (!isQuestionnaireFieldRequired(field, annotation)) continue;
    // Once a field is filled it is resolved for gating purposes, even if a
    // reviewer's annotation is still attached to it. Nothing clears an
    // annotation client-side, so treating it as permanently missing would
    // block resubmission forever.
    if (isFieldFilled(field, values[name])) continue;
    missing.push({ key: name, label: field.label });
  }
  return missing;
}

/**
 * Required Detailed Analysis fields, listed in the order the form renders them
 * so the summary reads top to bottom. The second entry of each pair is the
 * translation key the form itself labels the field with, so the summary and the
 * field always say the same thing.
 */
const TREE_REQUIRED = [
  ['employeesCount', 'employeeCount'],
  ['ecosystem', 'ecosystem'],
  ['mainInterventions', 'labelMainInterventions'],
  ['plantingDensity', 'plantingDensity'],
  ['degradationCause', 'causeOfDegradation'],
  ['mainChallenge', 'mainChallenge'],
  ['motivation', 'whyThisSite'],
  ['longTermPlan', 'longTermPlan'],
  ['siteOwnerType', 'siteOwner'],
  ['siteOwnerName', 'ownerName'],
] as const;

const CONSERVATION_REQUIRED = [
  ['areaProtected', 'areaProtected'],
  ['startingProtectionYear', 'protectionStartedIN'],
  ['ecosystem', 'ecosystem'],
  ['ownershipType', 'ownershipType'],
  ['landOwnershipType', 'siteOwner'],
  ['actions', 'forestProtectionType'],
  ['mainChallenge', 'mainChallenge'],
  ['motivation', 'whyThisSite'],
  // longTermPlan is deliberately absent: the form only requires it for trees.
  ['siteOwnerName', 'ownerName'],
] as const;

/**
 * Single source of truth for Detailed Analysis completeness. The tab dot, the
 * in-page summary and the Review page all read this, so they can never
 * disagree about what is still missing.
 */
/**
 * The translation keys the two lists above use. Typing the translator against
 * this union keeps it compatible with next-intl's typed `t`, which rejects a
 * plain `(key: string) => string`.
 */
type LabelKey =
  | (typeof TREE_REQUIRED)[number][1]
  | (typeof CONSERVATION_REQUIRED)[number][1];

export function getDetailedAnalysisMissing(
  details: ExtendedProfileProjectProperties | null,
  t: (key: LabelKey) => string
): MissingField[] {
  if (!details) return [];
  const required: readonly (readonly [string, LabelKey])[] =
    details.purpose === 'trees' ? TREE_REQUIRED : CONSERVATION_REQUIRED;
  const metadata = (details.metadata ?? {}) as unknown as Record<
    string,
    unknown
  >;

  return required
    .filter(([key]) => {
      const value = metadata[key];
      if (Array.isArray(value)) return value.length === 0;
      return value === undefined || value === null || value === '';
    })
    .map(([key, labelKey]) => ({ key, label: t(labelKey) }));
}

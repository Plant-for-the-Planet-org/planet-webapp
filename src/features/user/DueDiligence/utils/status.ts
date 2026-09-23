import type {
  DueDiligenceChecklist,
  DueDiligenceCharitability,
} from '../../../common/types/dueDiligence';

export type Severity = 'success' | 'info' | 'warning';

/** Narrow on purpose: next-intl checks message keys against the English file. */
export type StandingMessageKey =
  | 'statusLapsed'
  | 'statusConfirmed'
  | 'statusConfirmedUntil'
  | 'statusInReview'
  | 'statusNotYetNeeded'
  | 'statusNotSubmitted';

export interface Standing {
  severity: Severity;
  messageKey: StandingMessageKey;
  /** The one date the message interpolates, already an ISO string. */
  date?: string;
}

/**
 * Where the organisation stands, in the order the facts override each other.
 *
 * A lapsed confirmation comes first because it is the one state that needs
 * action from an organisation that has already been through this once, and
 * `isCharitable` is false while it lasts.
 */
export function standingOf(
  charitability: DueDiligenceCharitability
): Standing {
  if (charitability.lapsed) {
    return {
      severity: 'warning',
      messageKey: 'statusLapsed',
      date: charitability.until ?? undefined,
    };
  }

  if (charitability.isCharitable) {
    return charitability.until
      ? {
          severity: 'success',
          messageKey: 'statusConfirmedUntil',
          date: charitability.until,
        }
      : { severity: 'success', messageKey: 'statusConfirmed' };
  }

  if (charitability.submittedAt) {
    return {
      severity: 'info',
      messageKey: 'statusInReview',
      date: charitability.submittedAt,
    };
  }

  // Nothing is wrong here: an organisation whose projects take no donations has
  // no reason to file yet, and an incomplete list is not a problem for it.
  if (!charitability.required) {
    return { severity: 'info', messageKey: 'statusNotYetNeeded' };
  }

  return { severity: 'info', messageKey: 'statusNotSubmitted' };
}

/**
 * What a reviewer would find missing, documents and fields together.
 *
 * Optional documents are left out: they are on the list because they do not
 * exist in every country, and naming them as outstanding would ask an
 * organisation for something it cannot get.
 */
export function outstandingItems(checklist: DueDiligenceChecklist): string[] {
  const documents = checklist.documents
    .filter((item) => item.required && !item.fulfilled)
    .map((item) => item.label);

  return [...documents, ...checklist.fieldsMissing];
}

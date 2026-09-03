import type { DocumentReference } from './project';

/** One row of the organisation's document checklist. */
export interface DueDiligenceDocument {
  kind: string;
  label: string;
  required: boolean;
  note: string | null;
  fulfilled: boolean;
  current: DocumentReference | null;
}

/** The organisation data a reviewer reads alongside the documents. */
export interface DueDiligenceFields {
  registrationNumber: string | null;
  tin: string | null;
  contactFirstName: string | null;
  contactLastName: string | null;
  contactEmail: string | null;
  authorizedRepresentatives: string | null;
}

export type DueDiligenceFieldName = keyof DueDiligenceFields;

/**
 * Where the organisation stands, which a complete checklist does not answer.
 * A reviewer still has to look at the evidence, and a past confirmation runs out.
 */
export interface DueDiligenceCharitability {
  /** False while no project of this organisation accepts donations. */
  required: boolean;
  /** Set while a submission is waiting for a reviewer. */
  submittedAt: string | null;
  isCharitable: boolean;
  lapsed: boolean;
  verifiedAt: string | null;
  until: string | null;
  /** What a reviewer asked the organisation to fix. */
  feedback: string | null;
}

export interface DueDiligenceChecklist {
  complete: boolean;
  documents: DueDiligenceDocument[];
  /** Human labels of the mandatory fields still empty, as the backend names them. */
  fieldsMissing: string[];
  /** Optional only to survive a deploy where the backend has not shipped them yet. */
  fields?: DueDiligenceFields;
  charitability: DueDiligenceCharitability;
}

export interface DueDiligenceFieldsResponse {
  fields: DueDiligenceFields;
  fieldsMissing: string[];
}

export interface DueDiligenceSubmitResponse {
  submittedAt: string | null;
}

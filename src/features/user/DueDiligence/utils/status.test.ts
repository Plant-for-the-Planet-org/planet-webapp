import type {
  DueDiligenceChecklist,
  DueDiligenceCharitability,
  DueDiligenceDocument,
} from '../../../common/types/dueDiligence';

import { describe, expect, it } from 'vitest';
import { outstandingItems, standingOf } from './status';

const charitability = (
  overrides: Partial<DueDiligenceCharitability> = {}
): DueDiligenceCharitability => ({
  required: true,
  submittedAt: null,
  isCharitable: false,
  lapsed: false,
  verifiedAt: null,
  until: null,
  feedback: null,
  ...overrides,
});

const document = (
  overrides: Partial<DueDiligenceDocument> = {}
): DueDiligenceDocument => ({
  kind: 'ro_bylaws',
  label: 'Organization Bylaws',
  required: true,
  note: null,
  fulfilled: false,
  current: null,
  ...overrides,
});

const checklist = (
  overrides: Partial<DueDiligenceChecklist> = {}
): DueDiligenceChecklist => ({
  complete: false,
  documents: [],
  fieldsMissing: [],
  fields: {
    registrationNumber: null,
    tin: null,
    contactFirstName: null,
    contactLastName: null,
    contactEmail: null,
    authorizedRepresentatives: null,
  },
  charitability: charitability(),
  ...overrides,
});

describe('standingOf', () => {
  it('asks a new organisation to file', () => {
    expect(standingOf(charitability()).messageKey).toBe('statusNotSubmitted');
  });

  /**
   * An organisation whose projects take no donations is not behind on
   * anything, so an empty checklist must not read as a problem.
   */
  it('does not chase an organisation that does not need this yet', () => {
    const standing = standingOf(charitability({ required: false }));

    expect(standing.messageKey).toBe('statusNotYetNeeded');
    expect(standing.severity).toBe('info');
  });

  it('says we owe an answer once something is submitted', () => {
    const standing = standingOf(
      charitability({ submittedAt: '2026-09-01T10:00:00+00:00' })
    );

    expect(standing.messageKey).toBe('statusInReview');
    expect(standing.date).toBe('2026-09-01T10:00:00+00:00');
  });

  it('names the date a confirmation runs out', () => {
    const standing = standingOf(
      charitability({ isCharitable: true, until: '2028-08-25' })
    );

    expect(standing.messageKey).toBe('statusConfirmedUntil');
    expect(standing.severity).toBe('success');
  });

  /**
   * Charitability lapses by the calendar rather than by anyone acting, so a
   * lapsed organisation has to be told even though nothing changed on our side.
   */
  it('puts a lapsed confirmation ahead of everything else', () => {
    const standing = standingOf(
      charitability({
        lapsed: true,
        until: '2026-08-01',
        submittedAt: '2026-09-01T10:00:00+00:00',
      })
    );

    expect(standing.messageKey).toBe('statusLapsed');
    expect(standing.severity).toBe('warning');
  });
});

describe('outstandingItems', () => {
  it('lists missing documents before missing fields', () => {
    const items = outstandingItems(
      checklist({
        documents: [document()],
        fieldsMissing: ['Tax ID'],
      })
    );

    expect(items).toEqual(['Organization Bylaws', 'Tax ID']);
  });

  /**
   * The optional documents are optional because they do not exist in every
   * country, so asking for them would be asking for the unobtainable.
   */
  it('never asks for an optional document', () => {
    const items = outstandingItems(
      checklist({
        documents: [document({ required: false })],
      })
    );

    expect(items).toEqual([]);
  });

  it('says nothing is outstanding once everything is filed', () => {
    const items = outstandingItems(
      checklist({ documents: [document({ fulfilled: true })] })
    );

    expect(items).toEqual([]);
  });
});

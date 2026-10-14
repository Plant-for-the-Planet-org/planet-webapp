import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearStoredDirectGift,
  readStoredDirectGift,
  storeDirectGift,
} from './directGift';

const VALID_GIFT = {
  id: 'jane-doe',
  displayName: 'Jane Doe',
  type: 'individual',
};

const writeRawDirectGift = (value: unknown) =>
  localStorage.setItem(
    'directGift',
    typeof value === 'string' ? value : JSON.stringify(value)
  );

describe('readStoredDirectGift', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when nothing is stored', () => {
    expect(readStoredDirectGift()).toBeNull();
  });

  it('returns a valid stored gift and keeps it stored', () => {
    writeRawDirectGift(VALID_GIFT);

    expect(readStoredDirectGift()).toEqual(VALID_GIFT);
    expect(localStorage.getItem('directGift')).not.toBeNull();
  });

  it('returns null and clears the key for malformed JSON', () => {
    writeRawDirectGift('{not json');

    expect(readStoredDirectGift()).toBeNull();
    expect(localStorage.getItem('directGift')).toBeNull();
  });

  it('returns null and clears the key when a field is missing', () => {
    writeRawDirectGift({ id: 'jane-doe', displayName: 'Jane Doe' });

    expect(readStoredDirectGift()).toBeNull();
    expect(localStorage.getItem('directGift')).toBeNull();
  });

  it('returns null and clears the key for a stored null', () => {
    writeRawDirectGift('null');

    expect(readStoredDirectGift()).toBeNull();
    expect(localStorage.getItem('directGift')).toBeNull();
  });
});

describe('storeDirectGift', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores a gift that readStoredDirectGift reads back', () => {
    storeDirectGift(VALID_GIFT);

    expect(readStoredDirectGift()).toEqual(VALID_GIFT);
  });
});

describe('clearStoredDirectGift', () => {
  it('removes the stored gift', () => {
    writeRawDirectGift(VALID_GIFT);

    clearStoredDirectGift();

    expect(localStorage.getItem('directGift')).toBeNull();
  });
});

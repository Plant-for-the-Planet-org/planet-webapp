import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { validateToken } from './validateToken';

const NOW = new Date('2026-01-01T00:00:00.000Z');
const NOW_IN_SECONDS = NOW.getTime() / 1000;

// jwt-decode does not check the signature, so only the payload segment has to be real base64.
const makeToken = (payload: Record<string, unknown>): string =>
  `header.${btoa(JSON.stringify(payload))}.signature`;

describe('validateToken', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('accepts a token that expires in the future', () => {
    expect(validateToken(makeToken({ exp: NOW_IN_SECONDS + 3600 }))).toBe(true);
  });

  it('rejects a token that has already expired', () => {
    expect(validateToken(makeToken({ exp: NOW_IN_SECONDS - 1 }))).toBe(false);
  });

  it('accepts a token that expires exactly now', () => {
    // Permits tokens that expire right when the request is being made
    expect(validateToken(makeToken({ exp: NOW_IN_SECONDS }))).toBe(true);
  });

  it('rejects a token with no exp claim', () => {
    expect(validateToken(makeToken({ sub: 'auth0|123' }))).toBe(false);
  });

  it('rejects a token with exp set to 0', () => {
    expect(validateToken(makeToken({ exp: 0 }))).toBe(false);
  });

  // RFC 7519 requires exp to be a number, and comparing a string against the clock silently yields NaN.
  it('rejects a token with a non-numeric exp claim', () => {
    expect(validateToken(makeToken({ exp: 'tomorrow' }))).toBe(false);
  });

  // validateToken must return false, not throw. Otherwise the caller needs to catch the error.
  it('returns false when the token is not JWT-shaped', () => {
    expect(validateToken('not-a-jwt')).toBe(false);
  });

  // validateToken must return false, not throw. Otherwise the caller needs to catch the error.
  it('returns false when the payload cannot be decoded', () => {
    expect(validateToken('header.!!!not-base64!!!.signature')).toBe(false);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';

import { setHeaderForImpersonation } from './setHeader';

const STORED = { targetEmail: 'stored@example.org', supportPin: '1111' };
const ARGUMENT = { targetEmail: 'argument@example.org', supportPin: '2222' };

const initStoredImpersonationData = (data: unknown) =>
  localStorage.setItem('impersonationData', JSON.stringify(data));

const clearStoredImpersonationData = () =>
  localStorage.removeItem('impersonationData');

describe('setHeaderForImpersonation', () => {
  beforeEach(() => {
    clearStoredImpersonationData();
  });

  it('returns the header unchanged when there is no impersonation data in localStorage or the argument', () => {
    expect(setHeaderForImpersonation({ 'x-locale': 'en' })).toEqual({
      'x-locale': 'en',
    });
  });

  it('sets both headers from localStorage when no impersonation data is passed', () => {
    initStoredImpersonationData(STORED);

    expect(setHeaderForImpersonation({})).toEqual({
      'X-SWITCH-USER': 'stored@example.org',
      'X-USER-SUPPORT-PIN': '1111',
    });
  });

  // Fails until #3056 is fixed. The backend needs both headers, so half a pair is unusable.
  it('sets no headers when the stored data has no pin', () => {
    initStoredImpersonationData({ targetEmail: 'stored@example.org' });

    expect(setHeaderForImpersonation({ 'x-locale': 'en' })).toEqual({
      'x-locale': 'en',
    });
  });

  // Fails until #3056 is fixed. A pin alone is ignored by the backend.
  it('sets no headers when the stored data has no email', () => {
    initStoredImpersonationData({ supportPin: '1111' });

    expect(setHeaderForImpersonation({ 'x-locale': 'en' })).toEqual({
      'x-locale': 'en',
    });
  });

  it('prefers the argument over localStorage', () => {
    initStoredImpersonationData(STORED);

    expect(setHeaderForImpersonation({}, ARGUMENT)).toEqual({
      'X-SWITCH-USER': 'argument@example.org',
      'X-USER-SUPPORT-PIN': '2222',
    });
  });

  // Fails until #3056 is fixed. Mixing sources lets a stale stored pin travel with a new email.
  it('does not combine fields from the argument and localStorage', () => {
    initStoredImpersonationData(STORED);

    expect(
      setHeaderForImpersonation(
        { 'x-locale': 'en' },
        { ...ARGUMENT, supportPin: '' }
      )
    ).toEqual({
      'x-locale': 'en',
    });
  });

  it('sets both headers from the argument when localStorage is empty', () => {
    expect(setHeaderForImpersonation({}, ARGUMENT)).toEqual({
      'X-SWITCH-USER': 'argument@example.org',
      'X-USER-SUPPORT-PIN': '2222',
    });
  });

  it('keeps existing header keys alongside the impersonation ones', () => {
    initStoredImpersonationData(STORED);

    expect(
      setHeaderForImpersonation({
        Authorization: 'Bearer token',
        'x-locale': 'en',
      })
    ).toEqual({
      Authorization: 'Bearer token',
      'x-locale': 'en',
      'X-SWITCH-USER': 'stored@example.org',
      'X-USER-SUPPORT-PIN': '1111',
    });
  });

  // Fails until PR #3050 lands. Today the parse throws, and useApi calls this on every request, so one bad value blocks every API call with no way to recover.
  it('sets no headers when the stored data is not valid JSON', () => {
    // Set directly rather than via the helper, which stringifies and so cannot produce invalid JSON.
    localStorage.setItem('impersonationData', 'not json');

    expect(setHeaderForImpersonation({ 'x-locale': 'en' })).toEqual({
      'x-locale': 'en',
    });
  });
});

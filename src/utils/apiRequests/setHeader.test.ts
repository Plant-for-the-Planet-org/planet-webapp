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

  it('sets no headers when the stored data has no pin', () => {
    initStoredImpersonationData({ targetEmail: 'stored@example.org' });

    expect(setHeaderForImpersonation({ 'x-locale': 'en' })).toEqual({
      'x-locale': 'en',
    });
  });

  it('sets no headers when the stored data has no email', () => {
    initStoredImpersonationData({ supportPin: '1111' });

    expect(setHeaderForImpersonation({ 'x-locale': 'en' })).toEqual({
      'x-locale': 'en',
    });
  });

  it('sets no headers when a stored field is not a string', () => {
    initStoredImpersonationData({ ...STORED, supportPin: 1111 });

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

  it('sets no headers when the argument has no pin', () => {
    expect(
      setHeaderForImpersonation(
        { 'x-locale': 'en' },
        { ...ARGUMENT, supportPin: '' }
      )
    ).toEqual({
      'x-locale': 'en',
    });
  });

  it('sets no headers when the argument has no email', () => {
    expect(
      setHeaderForImpersonation(
        { 'x-locale': 'en' },
        { ...ARGUMENT, targetEmail: '' }
      )
    ).toEqual({
      'x-locale': 'en',
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

  it('does not mutate the header it is given', () => {
    initStoredImpersonationData(STORED);

    const header = { 'x-locale': 'en' };
    const result = setHeaderForImpersonation(header);

    expect(header).toEqual({ 'x-locale': 'en' });
    expect(result).not.toBe(header);
  });

  it('sets no headers when the stored data is not valid JSON', () => {
    // Set directly rather than via the helper, which stringifies and so cannot produce invalid JSON.
    localStorage.setItem('impersonationData', 'not json');

    expect(setHeaderForImpersonation({ 'x-locale': 'en' })).toEqual({
      'x-locale': 'en',
    });
  });
});

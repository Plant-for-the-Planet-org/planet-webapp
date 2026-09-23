import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  MAX_REDIRECT_ATTEMPTS,
  clearRedirectCount,
  hasExceededRedirectLimit,
  registerRedirectAttempt,
} from './authRedirectGuard';

const STORAGE_KEY = 'authRedirectCount';

const storedCount = () => sessionStorage.getItem(STORAGE_KEY);

const reachLimit = () => {
  for (let i = 0; i < MAX_REDIRECT_ATTEMPTS; i++) registerRedirectAttempt();
};

describe('authRedirectGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearRedirectCount();
  });

  it('does not report the limit before any attempt', () => {
    expect(hasExceededRedirectLimit()).toBe(false);
  });

  it('counts attempts in sessionStorage so they survive a full-page redirect', () => {
    registerRedirectAttempt();
    expect(storedCount()).toBe('1');

    registerRedirectAttempt();
    expect(storedCount()).toBe('2');
  });

  it('reports the limit only once the maximum is reached', () => {
    for (let i = 0; i < MAX_REDIRECT_ATTEMPTS - 1; i++) {
      registerRedirectAttempt();
      expect(hasExceededRedirectLimit()).toBe(false);
    }

    registerRedirectAttempt();
    expect(hasExceededRedirectLimit()).toBe(true);
  });

  it('clears the count', () => {
    reachLimit();
    expect(hasExceededRedirectLimit()).toBe(true);

    clearRedirectCount();

    expect(hasExceededRedirectLimit()).toBe(false);
    expect(storedCount()).toBeNull();
  });

  it('picks up a count left by an earlier page load', () => {
    sessionStorage.setItem(STORAGE_KEY, String(MAX_REDIRECT_ATTEMPTS));

    expect(hasExceededRedirectLimit()).toBe(true);
  });

  it('ignores a corrupted stored value instead of trusting it', () => {
    sessionStorage.setItem(STORAGE_KEY, 'not-a-number');

    expect(hasExceededRedirectLimit()).toBe(false);

    registerRedirectAttempt();
    expect(storedCount()).toBe('1');
  });

  describe('when storage access throws (private mode, blocked storage)', () => {
    beforeEach(() => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage blocked');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage blocked');
      });
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('storage blocked');
      });
    });

    it('still counts attempts and trips the limit, using the in-memory fallback', () => {
      expect(hasExceededRedirectLimit()).toBe(false);

      reachLimit();

      expect(hasExceededRedirectLimit()).toBe(true);
    });

    it('still clears the count', () => {
      reachLimit();

      clearRedirectCount();

      expect(hasExceededRedirectLimit()).toBe(false);
    });
  });
});

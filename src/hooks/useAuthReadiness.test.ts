import type { User } from '@planet-sdk/common';

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore, useUserStore } from '../stores';
import { resetAllStores } from '../test-utils';
import { useIsAuthReady, useIsProfileReady } from './useAuthReadiness';

const profile = { id: 'user-1' } as User;

const readHooks = () =>
  renderHook(() => ({
    isAuthReady: useIsAuthReady(),
    isProfileReady: useIsProfileReady(),
  })).result.current;

describe('auth/profile readiness hooks', () => {
  beforeEach(() => {
    resetAllStores();
  });

  it('are both false before isAuthResolved', () => {
    expect(readHooks()).toEqual({ isAuthReady: false, isProfileReady: false });
  });

  it('are both false for a signed-out user', () => {
    useAuthStore.setState({ token: null, isAuthResolved: true });

    expect(readHooks()).toEqual({ isAuthReady: false, isProfileReady: false });
  });

  // A new user before signup is the case that tells the two hooks apart.
  it('treat a token without a profile as auth ready but not profile ready', () => {
    useAuthStore.setState({ token: 'token', isAuthResolved: true });

    expect(readHooks()).toEqual({ isAuthReady: true, isProfileReady: false });
  });

  // useInitializeUser stores the profile first and sets isAuthResolved later, in the fetch's finally, so this pair can exist for a moment.
  it('wait for isAuthResolved even when the profile is already set', () => {
    useAuthStore.setState({ token: 'token', isAuthResolved: false });
    useUserStore.setState({ userProfile: profile });

    expect(readHooks()).toEqual({ isAuthReady: false, isProfileReady: false });
  });

  it('are both true once the token, profile and isAuthResolved are set', () => {
    useAuthStore.setState({ token: 'token', isAuthResolved: true });
    useUserStore.setState({ userProfile: profile });

    expect(readHooks()).toEqual({ isAuthReady: true, isProfileReady: true });
  });
});

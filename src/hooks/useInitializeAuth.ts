import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../stores';
import { useAuthSession } from './useAuthSession';

// Store the redirect count in sessionStorage so it survives page reloads
// and stops repeated login redirects after the limit is reached.
const REDIRECT_COUNT_STORAGE_KEY = 'authRedirectCount';
const MAX_REDIRECT_ATTEMPTS = 3;

// In-memory fallback for contexts where storage access throws (private mode, blocked storage). The persistent count is best-effort; what matters is that a storage failure never stops the auth flow from redirecting or resolving.
let inMemoryRedirectCount = 0;

const getRedirectCount = (): number => {
  try {
    const stored = Number(sessionStorage.getItem(REDIRECT_COUNT_STORAGE_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  } catch {
    return inMemoryRedirectCount;
  }
};

const setRedirectCount = (count: number): void => {
  inMemoryRedirectCount = count;
  try {
    sessionStorage.setItem(REDIRECT_COUNT_STORAGE_KEY, String(count));
  } catch {
    // Storage blocked; the in-memory value above is the fallback.
  }
};

const clearRedirectCount = (): void => {
  inMemoryRedirectCount = 0;
  try {
    sessionStorage.removeItem(REDIRECT_COUNT_STORAGE_KEY);
  } catch {
    // Storage blocked; the in-memory reset above is the fallback.
  }
};

export const useInitializeAuth = () => {
  const {
    isAuthLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuthSession();
  // store: action
  const setToken = useAuthStore((state) => state.setToken);
  const setIsAuthResolved = useAuthStore((state) => state.setIsAuthResolved);

  const redirectToLogin = useCallback(() => {
    const redirectCount = getRedirectCount();
    if (redirectCount >= MAX_REDIRECT_ATTEMPTS) {
      console.error('Redirect limit reached, unable to authenticate user.');
      setIsAuthResolved(true);
      return;
    }

    setRedirectCount(redirectCount + 1);

    loginWithRedirect({
      redirectUri: `${window.location.origin}/login`,
      ui_locales: localStorage.getItem('language') || 'en',
    });
  }, [loginWithRedirect, setIsAuthResolved]);

  const loadToken = useCallback(async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
      // A successful auth means the loop (if any) is over; do not let a
      // stale count block a legitimate future re-login.
      clearRedirectCount();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching access token:', error);
      }

      redirectToLogin();
    }
  }, [getAccessTokenSilently, setToken, redirectToLogin]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setIsAuthResolved(true);
      return;
    }

    loadToken();
  }, [isAuthLoading, isAuthenticated, loadToken]);
};

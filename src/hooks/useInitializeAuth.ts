import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../stores';
import { useAuthSession } from './useAuthSession';

// Store the redirect count in sessionStorage so it survives page reloads
// and stops repeated login redirects after the limit is reached.
const REDIRECT_COUNT_STORAGE_KEY = 'authRedirectCount';
const MAX_REDIRECT_ATTEMPTS = 3;

const getRedirectCount = (): number => {
  const stored = Number(sessionStorage.getItem(REDIRECT_COUNT_STORAGE_KEY));
  return Number.isFinite(stored) && stored > 0 ? stored : 0;
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

    sessionStorage.setItem(
      REDIRECT_COUNT_STORAGE_KEY,
      String(redirectCount + 1)
    );

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
      sessionStorage.removeItem(REDIRECT_COUNT_STORAGE_KEY);
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

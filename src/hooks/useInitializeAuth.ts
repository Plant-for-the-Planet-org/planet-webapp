import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../stores';
import { useAuthSession } from './useAuthSession';
import {
  hasExceededRedirectLimit,
  registerRedirectAttempt,
} from '../utils/authRedirectGuard';

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
  const setHasAuthFailed = useAuthStore((state) => state.setHasAuthFailed);

  const redirectToLogin = useCallback(() => {
    if (hasExceededRedirectLimit()) {
      console.error('Redirect limit reached, unable to authenticate user.');
      setIsAuthResolved(true);
      setHasAuthFailed(true);
      return;
    }

    registerRedirectAttempt();

    loginWithRedirect({
      redirectUri: `${window.location.origin}/login`,
      ui_locales: localStorage.getItem('language') || 'en',
    });
  }, [loginWithRedirect, setIsAuthResolved, setHasAuthFailed]);

  const loadToken = useCallback(async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);

      // If the token is empty, the profile fetch will not run because it needs
      // a valid token. So auth must be resolved here instead.
      //
      // Keep the redirect counter unchanged. It should only be cleared after a
      // profile loads successfully in `useInitializeUser`.
      // Treated as a failed sign-in: the session is unusable, and a silent retry would return the same empty token.
      if (!accessToken) {
        setIsAuthResolved(true);
        setHasAuthFailed(true);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching access token:', error);
      }

      redirectToLogin();
    }
  }, [
    getAccessTokenSilently,
    setToken,
    setIsAuthResolved,
    setHasAuthFailed,
    redirectToLogin,
  ]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setIsAuthResolved(true);
      return;
    }

    loadToken();
  }, [isAuthLoading, isAuthenticated, loadToken]);
};

import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores';
import { useAuthSession } from './useAuthSession';

export const useInitializeAuth = () => {
  const {
    isAuthLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuthSession();
  const redirectCountRef = useRef(0);
  // store: action
  const setToken = useAuthStore((state) => state.setToken);
  const setIsAuthResolved = useAuthStore((state) => state.setIsAuthResolved);

  const redirectToLogin = useCallback(() => {
    if (redirectCountRef.current >= 3) {
      console.error('Redirect limit reached, unable to authenticate user.');
      return;
    }

    redirectCountRef.current += 1;

    loginWithRedirect({
      redirectUri: `${window.location.origin}/login`,
      ui_locales: localStorage.getItem('language') || 'en',
    });
  }, [loginWithRedirect]);

  const loadToken = useCallback(async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
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

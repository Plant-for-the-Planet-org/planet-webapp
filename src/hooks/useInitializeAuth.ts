import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useRef } from 'react';
import { useUserStore, useAuthStore } from '../stores';

export const useInitializeAuth = () => {
  const {
    isLoading: auth0Loading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const redirectCountRef = useRef(0);
  // store: action
  const setToken = useAuthStore((state) => state.setToken);
  const setIsProfileLoaded = useUserStore((state) => state.setIsProfileLoaded);

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
    if (auth0Loading) return;

    if (!isAuthenticated) {
      setIsProfileLoaded(true);
      return;
    }

    loadToken();
  }, [auth0Loading, isAuthenticated, loadToken, setIsProfileLoaded]);
};

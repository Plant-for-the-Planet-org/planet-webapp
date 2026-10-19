import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { clearRedirectCount } from '../utils/authRedirectGuard';

export const useAuthSession = () => {
  const {
    isLoading: isAuthLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logout: logoutFromAuth0,
    user: auth0User,
    error: auth0Error,
  } = useAuth0();

  const logoutUser = useCallback(
    (returnUrl: string | undefined = `${window.location.origin}/`) => {
      useUserStore.getState().exitImpersonation();
      useAuthStore.getState().setToken(null);
      // A logout is a clean slate, so a stale count must not block the next login from redirecting.
      clearRedirectCount();
      localStorage.removeItem('redirectLink');
      sessionStorage.removeItem('donationReceiptContext');
      logoutFromAuth0({ returnTo: returnUrl });
    },
    [logoutFromAuth0]
  );

  return {
    isAuthLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logoutUser,
    auth0User,
    auth0Error,
  };
};

import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthStore, useUserStore } from '../stores';
import useLocalizedPath from './useLocalizedPath';
import { removeLocaleFromPath } from '../utils/getLocalizedPath';
import {
  beginAuthExpiryHandling,
  hasExceededRedirectLimit,
  registerRedirectAttempt,
} from '../utils/authRedirectGuard';

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
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const setToken = useAuthStore((state) => state.setToken);
  const exitImpersonation = useUserStore((state) => state.exitImpersonation);

  const logoutUser = useCallback(
    (returnUrl: string | undefined = `${window.location.origin}/`) => {
      useUserStore.getState().exitImpersonation();
      localStorage.removeItem('redirectLink');
      sessionStorage.removeItem('donationReceiptContext');
      logoutFromAuth0({ returnTo: returnUrl });
    },
    [logoutFromAuth0]
  );

  /**
   * Handles expired or invalid auth sessions in one place.
   *
   * It clears the invalid token, saves the current page so the user can return
   * after logging in, and redirects to /login.
   *
   * `beginAuthExpiryHandling` makes sure this only runs once when multiple
   * requests fail with 401 at the same time. This prevents repeated logout
   * handling or replacing the saved return page with `/login`.
   */
  const handleAuthExpiry = useCallback(() => {
    if (!beginAuthExpiryHandling()) return;

    exitImpersonation();
    setToken(null);

    const currentPath = router.asPath;
    const isOnLoginPage =
      removeLocaleFromPath(currentPath.split('?')[0]) === '/login';
    // Already on /login: nothing to preserve, and redirecting again would
    // just loop.
    if (isOnLoginPage) return;

    localStorage.setItem('redirectLink', currentPath);

    // Same brake used for persistent profile 401s: if the login redirect
    // keeps firing without ever reaching a healthy session, stop instead of
    // looping.
    if (hasExceededRedirectLimit()) {
      console.error(
        '[Auth] Redirect limit reached after repeated auth failures, stopping login redirects.'
      );
      return;
    }
    registerRedirectAttempt();
    router.push(localizedPath('/login'));
  }, [router, localizedPath, setToken, exitImpersonation]);

  return {
    isAuthLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    logoutUser,
    handleAuthExpiry,
    auth0User,
    auth0Error,
  };
};

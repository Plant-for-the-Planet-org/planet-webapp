import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'next/router';
import useLocalizedPath from './useLocalizedPath';
import { useAuthStore } from '../stores';
import {
  beginAuthExpiryHandling,
  hasExceededRedirectLimit,
  registerRedirectAttempt,
  resetAuthExpiryHandling,
} from '../utils/authRedirectGuard';
import { removeLocaleFromPath } from '../utils/getLocalizedPath';
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

  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const setToken = useAuthStore((state) => state.setToken);
  const exitImpersonation = useUserStore((state) => state.exitImpersonation);

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
    // Already on /login, so there is nothing to preserve or redirect.
    // Release the lock since no auth recovery is running.
    if (isOnLoginPage) {
      resetAuthExpiryHandling();
      return;
    }

    localStorage.setItem('redirectLink', currentPath);
    // Stop redirecting if repeated 401s hit the redirect limit.
    // Release the lock so future auth expiry can still be handled.
    if (hasExceededRedirectLimit()) {
      console.error(
        '[Auth] Redirect limit reached after repeated auth failures, stopping login redirects.'
      );
      resetAuthExpiryHandling();
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
    handleAuthExpiry,
    logoutUser,
    auth0User,
    auth0Error,
  };
};

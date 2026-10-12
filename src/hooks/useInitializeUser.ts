import { useEffect, useRef } from 'react';
import { useAuthStore, useTenantStore, useUserStore } from '../stores';

import { useLocale } from 'next-intl';
import useProfileErrorHandler from './useProfileErrorHandler';
import { useAuthSession } from './useAuthSession';
import { clearRedirectCount } from '../utils/authRedirectGuard';
import { readStoredImpersonationData } from '../utils/impersonation';

export const useInitializeUser = () => {
  const locale = useLocale();
  const { isAuthLoading, isAuthenticated, auth0User, auth0Error } =
    useAuthSession();
  const { handleProfileError } = useProfileErrorHandler();
  // store: state
  const profileApiError = useUserStore((state) => state.profileApiError);
  const token = useAuthStore((state) => state.token);
  const profileRefetchNonce = useUserStore(
    (state) => state.profileRefetchNonce
  );
  const tenantId = useTenantStore((state) => state.tenantConfig.id);
  // store: action
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const setIsImpersonationModeOn = useUserStore(
    (state) => state.setIsImpersonationModeOn
  );
  const exitImpersonation = useUserStore((state) => state.exitImpersonation);
  const clearProfileApiError = useUserStore(
    (state) => state.clearProfileApiError
  );
  const setIsAuthResolved = useAuthStore((state) => state.setIsAuthResolved);

  // `isAuthResolved` means the first auth check and profile fetch are finished.
  //
  // It should become true only once, after the first profile fetch started by
  // this hook finishes. Later profile fetches, such as impersonation changes,
  // silent token refreshes, or manual refetches, must not set it back to false.
  //
  // This ref tracks whether that first fetch has already finished, so
  // `fetchUserProfile` can focus only on fetching the profile and does not
  // need to change the auth loading state.
  const hasResolvedInitialAuth = useRef(false);

  useEffect(() => {
    if (!token) return;
    // Note: Intentionally not refetching on locale/tenant changes
    fetchUserProfile({
      token,
      tenantId,
      locale,
    })
      .then(() => {
        // A successfully loaded profile means the session is working normally.
        // Reset the redirect counter so old failures do not affect future,
        // unrelated login or profile errors.
        clearRedirectCount();
      })
      .catch((err) => {
        // API errors are surfaced through `profileApiError` below.
        // Catching here only prevents an unhandled promise rejection.
        console.error('[Profile API] Failed to fetch user profile:', err);
      })
      .finally(() => {
        if (!hasResolvedInitialAuth.current) {
          hasResolvedInitialAuth.current = true;
          setIsAuthResolved(true);
        }
      });
  }, [token, profileRefetchNonce, fetchUserProfile, setIsAuthResolved]);

  useEffect(() => {
    if (!profileApiError) return;
    handleProfileError(profileApiError);
    // Clear the error after handling it so it does not run again later.
    clearProfileApiError();
  }, [profileApiError, handleProfileError, clearProfileApiError]);

  useEffect(() => {
    if (
      !isAuthLoading &&
      (auth0User === undefined || auth0Error !== undefined || !isAuthenticated)
    ) {
      exitImpersonation();
      return;
    }
    setIsImpersonationModeOn(readStoredImpersonationData() !== undefined);
  }, [auth0User, isAuthLoading, auth0Error, isAuthenticated]);
};

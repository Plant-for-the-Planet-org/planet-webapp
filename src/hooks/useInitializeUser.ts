import { useEffect } from 'react';
import { useAuthStore, useTenantStore, useUserStore } from '../stores';

import { useLocale } from 'next-intl';
import useProfileErrorHandler from './useProfileErrorHandler';
import { useAuthSession } from './useAuthSession';

export const useInitializeUser = () => {
  const locale = useLocale();
  const { isAuthLoading, isAuthenticated, auth0User, auth0Error } =
    useAuthSession();
  const { handleProfileError } = useProfileErrorHandler();
  // store: state
  const profileApiError = useUserStore((state) => state.profileApiError);
  const token = useAuthStore((state) => state.token);
  const shouldRefetchUserProfile = useUserStore(
    (state) => state.shouldRefetchUserProfile
  );
  const isImpersonationModeOn = useUserStore(
    (state) => state.isImpersonationModeOn
  );
  const tenantId = useTenantStore((state) => state.tenantConfig.id);
  // store: action
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const setIsImpersonationModeOn = useUserStore(
    (state) => state.setIsImpersonationModeOn
  );
  const exitImpersonation = useUserStore((state) => state.exitImpersonation);
  const initializeLocale = useUserStore((state) => state.initializeLocale);
  const clearProfileApiError = useUserStore(
    (state) => state.clearProfileApiError
  );

  useEffect(() => {
    if (!token) return;
    // Note: Intentionally not refetching on locale/tenant changes
    fetchUserProfile({
      token,
      tenantConfigId: tenantId,
      locale,
    }).catch((err) => {
      // API errors are surfaced through `profileApiError` below.
      // Catching here only prevents an unhandled promise rejection.
      console.error('[Profile API] Failed to fetch user profile:', err);
    });
  }, [token, shouldRefetchUserProfile, fetchUserProfile]);

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
    const impersonationData = localStorage.getItem('impersonationData');
    if (impersonationData !== null && !isImpersonationModeOn) {
      setIsImpersonationModeOn(true);
    } else if (impersonationData === null && isImpersonationModeOn) {
      setIsImpersonationModeOn(false);
    }
  }, [auth0User, isAuthLoading, auth0Error, isAuthenticated]);

  useEffect(() => {
    initializeLocale();
  }, []);
};

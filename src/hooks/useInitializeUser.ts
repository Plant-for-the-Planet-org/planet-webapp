import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useTenant } from '../features/common/Layout/TenantContext';
import { useLocale } from 'next-intl';
import { useAuth0 } from '@auth0/auth0-react';
import useProfileErrorHandler from './useProfileErrorHandler';

export const useInitializeUser = () => {
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const { isAuthenticated, user, isLoading, error } = useAuth0();
  const { handleProfileError } = useProfileErrorHandler();
  // store: state
  const profileApiError = useUserStore((state) => state.profileApiError);
  const token = useAuthStore((state) => state.token);
  const refetchUserData = useUserStore((state) => state.refetchUserData);
  const isImpersonationModeOn = useUserStore(
    (state) => state.isImpersonationModeOn
  );
  // store: action
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const setIsImpersonationModeOn = useUserStore(
    (state) => state.setIsImpersonationModeOn
  );
  const initializeLocale = useUserStore((state) => state.initializeLocale);

  useEffect(() => {
    if (token) {
      fetchUserProfile({
        tenantConfigId: tenantConfig.id,
        locale,
      });
    }
  }, [token, refetchUserData, fetchUserProfile]);

  useEffect(() => {
    if (!profileApiError) return;
    handleProfileError(profileApiError);
  }, [profileApiError, handleProfileError]);

  useEffect(() => {
    if (
      !isLoading &&
      (user === undefined || error !== undefined || !isAuthenticated)
    ) {
      localStorage.removeItem('impersonationData');
    }
    const impersonationData = localStorage.getItem('impersonationData');
    if (impersonationData !== null && !isImpersonationModeOn) {
      setIsImpersonationModeOn(true);
    } else if (impersonationData === null && isImpersonationModeOn) {
      setIsImpersonationModeOn(false);
    }
  }, [user, isLoading, error, isAuthenticated]);

  useEffect(() => {
    initializeLocale();
  }, []);
};

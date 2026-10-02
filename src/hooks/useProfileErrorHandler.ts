import type { APIError } from '@planet-sdk/common';

import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useAuthStore, useTenantStore, useUserStore } from '../stores';
import useLocalizedPath from './useLocalizedPath';
import { useAuthSession } from './useAuthSession';
import {
  hasExceededRedirectLimit,
  registerRedirectAttempt,
} from '../utils/authRedirectGuard';

const useProfileErrorHandler = () => {
  const router = useRouter();
  const locale = useLocale();
  const { loginWithRedirect } = useAuthSession();
  const { localizedPath } = useLocalizedPath();
  // store: state
  const tenantId = useTenantStore((state) => state.tenantConfig.id);
  // store: action
  const setToken = useAuthStore((state) => state.setToken);
  const setHasAuthFailed = useAuthStore((state) => state.setHasAuthFailed);
  const exitImpersonation = useUserStore((state) => state.exitImpersonation);
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);

  const handleProfileError = useCallback(
    (err: APIError) => {
      switch (err.statusCode) {
        // 303: signup not finished yet, send them to complete it
        case 303:
          router.push(localizedPath('/complete-signup'));
          break;

        // 401: token rejected (expired, invalid, or revoked), clear it and get a fresh one
        // Clear impersonation so a leftover session does not silently
        // resume impersonating this user after the next login.
        case 401:
          exitImpersonation();
          setToken(null);

          // Use the same redirect counter as token failures.
          // If the token keeps working but the profile keeps returning 401,
          // the counter will eventually stop the repeated login redirects.
          //
          // Once the limit is reached, show the failed-sign-in screen instead of redirecting again.
          if (hasExceededRedirectLimit()) {
            console.error(
              '[Profile API] Redirect limit reached after repeated 401s, stopping login redirects.'
            );
            setHasAuthFailed(true);
            break;
          }
          registerRedirectAttempt();

          loginWithRedirect({
            redirectUri: `${window.location.origin}/login`,
            ui_locales: localStorage.getItem('language') || 'en',
          });
          break;

        // 403: access forbidden. If impersonating, stop and reload the real user
        // Read the latest store state.
        case 403: {
          const { isImpersonationModeOn } = useUserStore.getState();
          const { token } = useAuthStore.getState();
          // Exit impersonation if it is active.
          if (isImpersonationModeOn) {
            exitImpersonation();
            // Restore the real user's profile.
            if (token) {
              // The refetch runs without impersonation data, so a further
              // failure goes through this same handler again.
              fetchUserProfile({ token, tenantId, locale }).catch(
                (error: APIError) => handleProfileError(error)
              );
            }
          }
          break;
        }
        // 500: server error, nothing the client can do, just log it
        case 500:
          console.error('[Profile API] Internal Server Error:', err.message);
          break;

        // Any other status, log it for debugging
        default:
          console.error('[Profile API] Error:', err.message);
          break;
      }
    },
    [
      router,
      loginWithRedirect,
      localizedPath,
      setToken,
      setHasAuthFailed,
      exitImpersonation,
      fetchUserProfile,
      tenantId,
      locale,
    ]
  );

  return { handleProfileError };
};

export default useProfileErrorHandler;

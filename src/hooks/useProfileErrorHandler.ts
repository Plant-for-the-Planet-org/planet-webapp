import type { APIError } from '@planet-sdk/common';

import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useAuthStore, useTenantStore, useUserStore } from '../stores';
import useLocalizedPath from './useLocalizedPath';
import { useAuthSession } from './useAuthSession';

const useProfileErrorHandler = () => {
  const router = useRouter();
  const locale = useLocale();
  const { handleAuthExpiry } = useAuthSession();
  const { localizedPath } = useLocalizedPath();
  // store: state
  const tenantId = useTenantStore((state) => state.tenantConfig.id);
  // store: action
  const exitImpersonation = useUserStore((state) => state.exitImpersonation);
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);

  const handleProfileError = useCallback(
    (err: APIError) => {
      switch (err.statusCode) {
        // 303: signup not finished yet, send them to complete it
        case 303:
          router.push(localizedPath('/complete-signup'));
          break;

        // 401: token rejected (expired, invalid, or revoked). Recover through
        // the same shared path as every other authenticated request: clear
        // the token and impersonation, preserve the current route, and
        // redirect to /login.
        case 401:
          handleAuthExpiry();
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
              fetchUserProfile({ token, tenantId, locale })
                // The refetch runs without impersonation data, so a further
                // failure is recorded in `profileApiError` and handled here again.
                .catch((error) =>
                  console.error(
                    '[Profile API] Failed to restore the real user profile:',
                    error
                  )
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
      handleAuthExpiry,
      localizedPath,
      exitImpersonation,
      fetchUserProfile,
      tenantId,
      locale,
    ]
  );

  return { handleProfileError };
};

export default useProfileErrorHandler;

import type { User } from '@planet-sdk/common';
import type { ImpersonationData } from '../utils/apiRequests/impersonation';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import getsessionId from '../utils/apiRequests/getSessionId';
import { setHeaderForImpersonation } from '../utils/apiRequests/setHeader';
import { APIError } from '@planet-sdk/common';
import { useAuthStore } from './authStore';

// No real HTTP response was involved (network failure, JSON parsing, a
// session-id/localStorage failure, ...). Mirrors the INVALID_TOKEN_STATUS_CODE
// convention in useApi.ts for a synthetic, non-server status code.
const NON_HTTP_ERROR_STATUS_CODE = 0;

type FetchUserProfileParams = {
  token: string | null;
  impersonationData?: ImpersonationData;
  tenantId: string;
  locale: string;
};

interface UserStore {
  userProfile: User | null;
  shouldRefetchUserProfile: boolean;
  isImpersonationModeOn: boolean;
  profileApiError: APIError | null;

  setUserProfile: (profile: User | null) => void;
  setIsImpersonationModeOn: (isEnabled: boolean) => void;
  enterImpersonation: (impersonationData: ImpersonationData) => void;
  exitImpersonation: () => void;
  setShouldRefetchUserProfile: (shouldRefetch: boolean) => void;
  fetchUserProfile: (params: FetchUserProfileParams) => Promise<User>;
  clearProfileApiError: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      //states
      userProfile: null,
      shouldRefetchUserProfile: false,
      isImpersonationModeOn: false,
      profileApiError: null,

      //actions
      setUserProfile: (profile) =>
        set({ userProfile: profile }, undefined, 'userStore/set_user_profile'),

      setIsImpersonationModeOn: (isEnabled) =>
        set(
          { isImpersonationModeOn: isEnabled },
          undefined,
          'userStore/set_is_impersonation_mode_on'
        ),

      /**
       * Enter impersonation by setting both the UI state and local storage.
       * Keep them in sync to avoid inconsistent impersonation state.
       */
      enterImpersonation: (impersonationData) => {
        localStorage.setItem(
          'impersonationData',
          JSON.stringify(impersonationData)
        );
        set(
          { isImpersonationModeOn: true },
          undefined,
          'userStore/enter_impersonation'
        );
      },

      /**
       * Exit impersonation by clearing both the UI state and local storage.
       * Keep them in sync to avoid inconsistent impersonation state.
       */
      exitImpersonation: () => {
        localStorage.removeItem('impersonationData');
        set(
          { isImpersonationModeOn: false },
          undefined,
          'userStore/exit_impersonation'
        );
      },

      setShouldRefetchUserProfile: (shouldRefetch) =>
        set(
          { shouldRefetchUserProfile: shouldRefetch },
          undefined,
          'userStore/set_should_refetch_user_profile'
        ),

      fetchUserProfile: async ({
        token,
        impersonationData,
        tenantId,
        locale,
      }) => {
        if (!process.env.API_ENDPOINT) {
          throw new Error(
            'API_ENDPOINT is not defined in the environment variables.'
          );
        }

        const { setIsAuthResolved } = useAuthStore.getState();
        setIsAuthResolved(false);

        try {
          // Inside the try so a localStorage failure still resolves auth
          // via the finally block below.
          const sessionId = await getsessionId();
          const header = {
            'tenant-key': `${tenantId}`,
            'X-SESSION-ID': sessionId,
            Authorization: `Bearer ${token}`,
            'x-locale': locale,
          };

          const response = await fetch(
            `${process.env.API_ENDPOINT}/app/profile`,
            {
              method: 'GET',
              headers: setHeaderForImpersonation(header, impersonationData),
            }
          );

          if (!response.ok) {
            throw new APIError(response.status, 'Failed to fetch user profile');
          }

          const result = await response.json();
          if (!result) {
            throw new APIError(
              response.status,
              'User profile response was empty'
            );
          }

          set(
            {
              userProfile: result,
              profileApiError: null,
            },
            undefined,
            'userStore/fetch_user_profile_success'
          );
          return result;
        } catch (error) {
          // Impersonation-specific 403: Handle ONLY in component

          // This runs only when `impersonationData` is passed to this function.
          // Currently, only ImpersonateUserForm passes it when starting impersonation,
          // so a 403 is handled by that component instead of the global handler.
          //
          // If another caller passes `impersonationData`, its 403 will also be handled locally.
          // If ImpersonateUserForm stops passing it, the impersonation header will be missing
          // and the API may return the support agent's profile instead of showing an error.

          if (
            error instanceof APIError &&
            error.statusCode === 403 &&
            impersonationData
          ) {
            set(
              {
                profileApiError: null, // do NOT trigger global handler
              },
              undefined,
              'userStore/fetch_user_profile_impersonation_error'
            );

            throw error; // handled by component
          }
          // All other errors → global handling

          // Convert non-API errors into APIError so the global error handler can handle them.
          // Keep the original error details for debugging.
          let apiError: APIError;
          if (error instanceof APIError) {
            apiError = error;
          } else {
            const originalMessage =
              error instanceof Error ? error.message : String(error);
            apiError = new APIError(NON_HTTP_ERROR_STATUS_CODE, {
              message: originalMessage,
            });
            apiError.cause = error;
          }

          // Clear the profile only when the user must sign up again (303)
          // or the session is no longer valid (401).
          // For temporary errors like 500 or network failures,
          // keep the existing profile so the user is not sent to /login.
          const patch: Partial<UserStore> = { profileApiError: apiError };
          if (apiError.statusCode === 303 || apiError.statusCode === 401) {
            patch.userProfile = null;
          }

          set(patch, undefined, 'userStore/fetch_user_profile_error');

          // Rethrow so the promise never resolves with `undefined`.
          // The global flow still runs via the `profileApiError` state above;
          // callers that only rely on that state can ignore this rejection.
          throw error;
        } finally {
          setIsAuthResolved(true);
        }
      },

      clearProfileApiError: () =>
        set(
          { profileApiError: null },
          undefined,
          'userStore/clear_profile_api_error'
        ),
    }),
    {
      name: 'UserStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);

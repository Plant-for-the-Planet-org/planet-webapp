import type { User } from '@planet-sdk/common';
import type { ImpersonationData } from '../utils/impersonation';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import getsessionId from '../utils/apiRequests/getSessionId';
import { setHeaderForImpersonation } from '../utils/apiRequests/setHeader';
import {
  clearImpersonationData,
  storeImpersonationData,
} from '../utils/impersonation';
import { APIError } from '@planet-sdk/common';

// No real HTTP response was involved (network failure, JSON parsing, a
// session-id/localStorage failure, ...). Mirrors the INVALID_TOKEN_STATUS_CODE
// convention in useApi.ts for a synthetic, non-server status code.
const NON_HTTP_ERROR_STATUS_CODE = 0;

// fetchUserProfile has no single owner - the token effect, the 403 handler,
// and the impersonation enter/exit screens can all call it around the same
// time, with no cancellation. This id lets a call detect it has been
// superseded by a later one, so a slow, stale response cannot overwrite the
// store with the wrong identity. It is a cheap guard, not real request
// sequencing (no AbortController, no cancellation) - see review item #14/A3.
let latestFetchUserProfileRequestId = 0;

type FetchUserProfileParams = {
  token: string;
  impersonationData?: ImpersonationData;
  tenantId: string;
  locale: string;
};

interface UserStore {
  userProfile: User | null;
  // Incremented on each refetch request so the fetch effect runs every time.
  profileRefetchNonce: number;
  isImpersonationModeOn: boolean;

  setUserProfile: (profile: User | null) => void;
  setIsImpersonationModeOn: (isEnabled: boolean) => void;
  enterImpersonation: (impersonationData: ImpersonationData) => void;
  exitImpersonation: () => void;
  refetchUserProfile: () => void;
  // Failures are returned to the caller (rejected promise), not written to
  // store state - see #3045.
  fetchUserProfile: (params: FetchUserProfileParams) => Promise<User>;
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      //states
      userProfile: null,
      profileRefetchNonce: 0,
      isImpersonationModeOn: false,

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
        storeImpersonationData(impersonationData);
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
        clearImpersonationData();
        set(
          { isImpersonationModeOn: false },
          undefined,
          'userStore/exit_impersonation'
        );
      },

      refetchUserProfile: () =>
        set(
          (state) => ({ profileRefetchNonce: state.profileRefetchNonce + 1 }),
          undefined,
          'userStore/refetch_user_profile'
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

        const requestId = ++latestFetchUserProfileRequestId;
        const isStale = () => requestId !== latestFetchUserProfileRequestId;

        try {
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

          // Superseded by a newer fetch: do not commit to store, and do not return a stale identity back to the caller (e.g. ImpersonateUserForm enters impersonation from this return value).
          if (isStale()) {
            throw new APIError(NON_HTTP_ERROR_STATUS_CODE, {
              message: 'Profile fetch superseded by a newer request',
            });
          }
          set(
            { userProfile: result },
            undefined,
            'userStore/fetch_user_profile_success'
          );
          return result;
        } catch (error) {
          // Impersonation-specific 403: Handle ONLY in the caller (ImpersonateUserForm).

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
            throw error; // handled by the caller, not the global handler
          }

          // Convert non-API errors into APIError so every caller can rely on
          // a consistent shape (e.g. read `statusCode`). Keep the original
          // error details for debugging.
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
          if (
            !isStale() &&
            (apiError.statusCode === 303 || apiError.statusCode === 401)
          ) {
            set(
              { userProfile: null },
              undefined,
              'userStore/fetch_user_profile_error'
            );
          }

          // Reject with the normalized error so the caller decides how to handle it.
          throw apiError;
        }
      },
    }),
    {
      name: 'UserStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);

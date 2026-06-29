import type { User } from '@planet-sdk/common';
import type { ImpersonationData } from '../utils/apiRequests/impersonation';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import getsessionId from '../utils/apiRequests/getSessionId';
import { setHeaderForImpersonation } from '../utils/apiRequests/setHeader';
import { APIError } from '@planet-sdk/common';
import { useAuthStore } from './authStore';

type FetchUserProfileParams = {
  token: string | null;
  impersonationData?: ImpersonationData;
  tenantConfigId: string;
  locale: string;
};

interface UserStore {
  userProfile: User | null;
  userLanguage: string;
  shouldRefetchUserProfile: boolean;
  isImpersonationModeOn: boolean;
  profileApiError: APIError | null;

  setUserProfile: (profile: User | null) => void;
  setIsImpersonationModeOn: (isEnabled: boolean) => void;
  setShouldRefetchUserProfile: (shouldRefetch: boolean) => void;
  fetchUserProfile: (params: FetchUserProfileParams) => Promise<User>;
  initializeLocale: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      //states
      userProfile: null,
      userLanguage: 'en',
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

      setShouldRefetchUserProfile: (shouldRefetch) =>
        set(
          { shouldRefetchUserProfile: shouldRefetch },
          undefined,
          'set_should_refetch_user_profile'
        ),

      fetchUserProfile: async ({
        token,
        impersonationData,
        tenantConfigId,
        locale,
      }) => {
        if (!process.env.API_ENDPOINT) {
          throw new Error(
            'API_ENDPOINT is not defined in the environment variables.'
          );
        }

        const { setIsAuthResolved } = useAuthStore.getState();
        setIsAuthResolved(false);

        const sessionId = await getsessionId();
        const header = {
          'tenant-key': `${tenantConfigId}`,
          'X-SESSION-ID': sessionId,
          Authorization: `Bearer ${token}`,
          'x-locale': locale,
        };

        try {
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
          if (result) {
            set(
              {
                userProfile: result,
                profileApiError: null,
              },
              undefined,
              'userStore/fetch_user_profile_success'
            );
          }
          return result;
        } catch (error) {
          // 🔹 Impersonation-specific 403: Handle ONLY in component
          if (
            error instanceof APIError &&
            error.statusCode === 403 &&
            impersonationData
          ) {
            set(
              {
                profileApiError: null, // ❌ do NOT trigger global handler
              },
              undefined,
              'userStore/fetch_user_profile_impersonation_error'
            );

            throw error; // handled by component
          }
          // 🔹 All other errors → global handling
          set(
            {
              userProfile: null,
              profileApiError: error instanceof APIError ? error : null,
            },
            undefined,
            'userStore/fetch_user_profile_error'
          );
        } finally {
          setIsAuthResolved(true);
        }
      },

      initializeLocale: () => {
        const storedLocale = localStorage.getItem('language');
        if (storedLocale) {
          set(
            { userLanguage: storedLocale },
            undefined,
            'userStore/init_locale'
          );
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

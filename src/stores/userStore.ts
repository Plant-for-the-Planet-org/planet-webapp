import type { User } from '@planet-sdk/common';
import type { ImpersonationData } from '../utils/apiRequests/impersonation';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import getsessionId from '../utils/apiRequests/getSessionId';
import { setHeaderForImpersonation } from '../utils/apiRequests/setHeader';
import { APIError } from '@planet-sdk/common';

type FetchUserProfileParams = {
  token: string | null;
  impersonationData?: ImpersonationData;
  tenantConfigId: string;
  locale: string;
};

interface UserStore {
  userProfile: User | null;
  isProfileLoaded: boolean;
  userLanguage: string;
  refetchUserData: boolean;
  isImpersonationModeOn: boolean;
  profileApiError: APIError | null;

  setUserProfile: (data: User | null) => void;
  setIsProfileLoaded: (value: boolean) => void;
  setIsImpersonationModeOn: (value: boolean) => void;
  setRefetchUserData: (value: boolean) => void;
  fetchUserProfile: (params: FetchUserProfileParams) => Promise<User>;
  initializeLocale: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      userProfile: null,
      isProfileLoaded: false,
      userLanguage: 'en',
      refetchUserData: false,
      isImpersonationModeOn: false,
      profileApiError: null,

      setIsProfileLoaded: (value) => set({ isProfileLoaded: value }),

      setIsImpersonationModeOn: (value) =>
        set({ isImpersonationModeOn: value }),

      setRefetchUserData: (value) => set({ refetchUserData: value }),

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

        set({ isProfileLoaded: false });
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
            set({
              userProfile: result,
              profileApiError: null,
              isProfileLoaded: true,
            });
          }
          return result;
        } catch (error) {
          // 🔹 Impersonation-specific 403: Handle ONLY in component
          if (
            error instanceof APIError &&
            error.statusCode === 403 &&
            impersonationData
          ) {
            set({
              userProfile: null,
              isProfileLoaded: true,
              profileApiError: null, // ❌ do NOT trigger global handler
            });

            throw error; // handled by component
          }
          // 🔹 All other errors → global handling
          set({
            userProfile: null,
            isProfileLoaded: true,
            profileApiError: error instanceof APIError ? error : null,
          });
        }
      },
      initializeLocale: () => {
        const storedLocale = localStorage.getItem('language');
        if (storedLocale) {
          set({ userLanguage: storedLocale });
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

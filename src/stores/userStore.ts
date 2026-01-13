import type { User } from '@planet-sdk/common';
import type { ImpersonationData } from '../utils/apiRequests/impersonation';
import type { LogoutOptions } from '@auth0/auth0-react';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import getsessionId from '../utils/apiRequests/getSessionId';
import { setHeaderForImpersonation } from '../utils/apiRequests/setHeader';
import { APIError } from '@planet-sdk/common';
import { useAuthStore } from './authStore';

type FetchUserProfileParams = {
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

  setUserProfile: (userProfile: User | null) => Promise<User>;
  setIsProfileLoaded: (value: boolean) => void;
  setUserLanguage: (value: string) => void;
  setIsImpersonationModeOn: (value: boolean) => void;
  setRefetchUserData: (value: boolean) => void;
  fetchUserProfile: (params: FetchUserProfileParams) => Promise<User>;
  logoutUser: (
    returnUrl: string | undefined,
    logout: (options?: LogoutOptions | undefined) => void
  ) => void;
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

      setUserLanguage: (value) => set({ userLanguage: value }),

      setIsProfileLoaded: (value) => set({ isProfileLoaded: value }),

      setIsImpersonationModeOn: (value) =>
        set({ isImpersonationModeOn: value }),

      setRefetchUserData: (value) => set({ refetchUserData: value }),

      fetchUserProfile: async ({
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
        //TODO: Take the  tenant id from the tenant store
        const { token } = useAuthStore.getState();
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

          const result = await response.json();
          if (result) {
            set({
              userProfile: result,
              profileApiError: null,
              isProfileLoaded: true,
            });
          }
        } catch (error) {
          set({
            userProfile: null,
            isProfileLoaded: true,
          });
          if (error instanceof APIError) {
            set({ profileApiError: error });
          } else {
            console.error('Unexpected error:', error);
          }
        }
      },
      logoutUser: (
        returnUrl: string | undefined = `${window.location.origin}/`,
        logout: (options?: LogoutOptions | undefined) => void
      ) => {
        localStorage.removeItem('impersonationData');
        localStorage.removeItem('redirectLink');
        sessionStorage.removeItem('donationReceiptContext');
        logout({ returnTo: returnUrl });
      },
    }),
    {
      name: 'UserStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);

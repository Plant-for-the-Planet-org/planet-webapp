import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  isAuthResolved: boolean;
  // Set when the redirect guard gives up, so the app can show a terminal screen instead of a loader that never ends.
  hasAuthFailed: boolean;

  setToken: (token: string | null) => void;
  setIsAuthResolved: (resolved: boolean) => void;
  setHasAuthFailed: (hasFailed: boolean) => void;
}
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      token: null,
      isAuthResolved: false,
      hasAuthFailed: false,

      setToken: (token) => set({ token }, undefined, 'authStore/set_token'),
      setIsAuthResolved: (resolved: boolean) =>
        set(
          { isAuthResolved: resolved },
          undefined,
          'authStore/set_is_auth_resolved'
        ),
      setHasAuthFailed: (hasFailed: boolean) =>
        set(
          { hasAuthFailed: hasFailed },
          undefined,
          'authStore/set_has_auth_failed'
        ),
    }),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);

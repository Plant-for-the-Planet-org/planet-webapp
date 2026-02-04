import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  isAuthResolved: boolean;

  setToken: (token: string | null) => void;
  setIsAuthResolved: (resolved: boolean) => void;
}
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      token: null,
      isAuthResolved: false,

      setToken: (token) => set({ token }),
      setIsAuthResolved: (resolved: boolean) =>
        set({ isAuthResolved: resolved }),
    }),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);

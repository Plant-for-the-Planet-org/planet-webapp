import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthStore {
  token: string | null;

  setToken: (token: string | null) => void;
}
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      token: null,

      setToken: (token) => set({ token }),
    }),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);

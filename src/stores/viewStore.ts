import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useViewStore = create()(
  devtools((set, get) => ({}), {
    name: 'ViewStore',
    enabled: process.env.NODE_ENV === 'development',
    serialize: { options: true },
  })
);

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useInterventionStore = create()(
  devtools((set, get) => ({}), {
    name: 'InterventionStore',
    enabled: process.env.NODE_ENV === 'development',
    serialize: { options: true },
  })
);

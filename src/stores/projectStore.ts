import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useProjectStore = create()(
  devtools((set, get) => ({}), {
    name: 'ProjectStore',
    enabled: process.env.NODE_ENV === 'development',
    serialize: { options: true },
  })
);

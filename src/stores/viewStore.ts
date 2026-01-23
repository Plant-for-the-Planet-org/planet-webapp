import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Page = 'project-list' | 'project-details';
interface ViewStore {
  page: Page;

  setPage: (currentPage: Page) => void;
}

export const useViewStore = create<ViewStore>()(
  devtools(
    (set) => ({
      page: 'project-list',

      setPage: (currentPage) =>
        set({ page: currentPage }, undefined, 'viewStore/set_current_page'),
    }),
    {
      name: 'ViewStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);

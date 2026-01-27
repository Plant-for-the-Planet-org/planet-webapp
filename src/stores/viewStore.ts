import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ViewMode = 'list' | 'map';
export type Page = 'project-list' | 'project-details' | null;
interface ViewStore {
  page: Page;
  selectedMode: ViewMode;

  setPage: (currentPage: Page) => void;
  setSelectedMode: (viewMode: ViewMode) => void;
}

export const useViewStore = create<ViewStore>()(
  devtools(
    (set) => ({
      page: null,
      selectedMode: 'list',

      setPage: (currentPage) =>
        set({ page: currentPage }, undefined, 'viewStore/set_current_page'),
      setSelectedMode: (viewMode) => set({ selectedMode: viewMode }),
    }),
    {
      name: 'ViewStore',
      enabled: process.env.NODE_ENV === 'development',
      serialize: { options: true },
    }
  )
);

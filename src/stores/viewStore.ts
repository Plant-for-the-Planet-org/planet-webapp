import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ViewMode = 'list' | 'map';

interface ViewStore {
  /**
   * View mode is primarily used for mobile layouts
   * (e.g. map ↔ list toggle on project details, project list page).
   */
  selectedMode: ViewMode;

  setSelectedMode: (viewMode: ViewMode) => void;
}

export const useViewStore = create<ViewStore>()(
  devtools(
    (set) => ({
      selectedMode: 'list',

      setSelectedMode: (viewMode) =>
        set({ selectedMode: viewMode }, undefined, 'viewStore/set_view_mode'),
    }),
    {
      name: 'ViewStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

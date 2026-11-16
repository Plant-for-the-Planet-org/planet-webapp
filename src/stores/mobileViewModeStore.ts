import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ViewMode = 'list' | 'map';

interface MobileViewModeStore {
  /**
   * View mode is primarily used for mobile layouts
   * (e.g. map ↔ list toggle on project details, project list page).
   */
  selectedMode: ViewMode;

  setSelectedMode: (viewMode: ViewMode) => void;
}

export const useMobileViewModeStore = create<MobileViewModeStore>()(
  devtools(
    (set) => ({
      selectedMode: 'list',

      setSelectedMode: (viewMode) =>
        set(
          { selectedMode: viewMode },
          undefined,
          'mobileViewModeStore/set_view_mode'
        ),
    }),
    {
      name: 'MobileViewModeStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

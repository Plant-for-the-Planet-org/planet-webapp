import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ViewMode = 'list' | 'map';
/**
 * `null` means the current view hasn't been determined yet, or the route is
 * not a project page. The value is set by `useInitializeView` once the router
 * is ready.
 */
export type Page = 'project-list' | 'project-details' | null;
interface ViewStore {
  page: Page;
  /**
   * View mode is primarily used for mobile layouts
   * (e.g. map ↔ list toggle on project details, project list page).
   */
  selectedMode: ViewMode;

  setPage: (currentPage: Page) => void;
  setSelectedMode: (viewMode: ViewMode) => void;
}

export const useViewStore = create<ViewStore>()(
  devtools(
    (set) => ({
      // Start unresolved. `useInitializeView` sets the page when the router is
      // ready. A concrete default can incorrectly trigger route-specific effects
      // before the current route is determined.
      page: null,
      selectedMode: 'list',

      setPage: (currentPage) =>
        set({ page: currentPage }, undefined, 'viewStore/set_current_page'),
      setSelectedMode: (viewMode) =>
        set({ selectedMode: viewMode }, undefined, 'viewStore/set_view_mode'),
    }),
    {
      name: 'ViewStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

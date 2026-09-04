import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ViewMode = 'list' | 'map';

/**
 * Pages that support embed mode. Single source of truth for the `Page` type
 * and the `isEmbeddablePage` check.
 */
export const EMBEDDABLE_PAGES = ['project-list', 'project-details'] as const;
export type EmbeddablePage = (typeof EMBEDDABLE_PAGES)[number];

/** `null` means the current route is not a project page. */
export type Page = EmbeddablePage | null;

/** Whether the given page is one that supports embed mode. */
export const isEmbeddablePage = (page: Page): page is EmbeddablePage =>
  page !== null && (EMBEDDABLE_PAGES as readonly string[]).includes(page);
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

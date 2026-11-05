import type { TreeProjectClassification } from '@planet-sdk/common';

/** A project marker as the map holds it, with the project fields the filters use. `classification` is `null` for conservation projects. */
export type E2EProjectMarker = {
  slug: string;
  allowDonations: boolean;
  purpose: 'trees' | 'conservation';
  classification: TreeProjectClassification | null;
};

declare global {
  interface Window {
    /** Read-only helpers for Playwright tests, set only when `areE2EHooksEnabled()` is true. */
    __planetE2E?: {
      /** The project markers on the map, or `null` before the marker source is added. */
      getProjectMarkers: () => Promise<E2EProjectMarker[] | null>;
    };
  }
}

/**
 * On in local development, and on builds where `NEXT_PUBLIC_E2E_HOOKS` is `"true"`, which is set for Vercel previews only.
 * Never set it for production: the hooks are harmless but are not part of the app.
 */
export const areE2EHooksEnabled = () =>
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_E2E_HOOKS === 'true';

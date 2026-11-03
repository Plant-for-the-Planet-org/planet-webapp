import type { TreeProjectClassification } from '@planet-sdk/common';

/** A project marker as the map holds it, with the project fields the filters use. `classification` is `null` for conservation projects. */
export type E2EProjectMarker = {
  slug: string;
  allowDonations: boolean;
  purpose: 'trees' | 'conservation';
  classification: TreeProjectClassification | null;
};

/** `[west, south, east, north]` in degrees. */
export type E2EBounds = [number, number, number, number];

/** A project site as the map holds it, with the bounds of its shape. */
export type E2EProjectSite = { id: string; bounds: E2EBounds };

/** What the map shows right now. */
export type E2EMapView = { center: [number, number]; bounds: E2EBounds };

export type E2EHooks = {
  /** The project markers on the map, or `null` before the marker source is added. */
  getProjectMarkers: () => Promise<E2EProjectMarker[] | null>;
  /** The sites of the open project on the map, or `null` before the site source is added. */
  getProjectSites: () => Promise<E2EProjectSite[] | null>;
  /** The map's current view, and whether it is still moving. */
  getMapView: () => E2EMapView & { isMoving: boolean };
};

declare global {
  interface Window {
    /** Read-only helpers for Playwright tests, set only when `areE2EHooksEnabled()` is true. Each one is there only while the part of the map it reads is shown. */
    __planetE2E?: Partial<E2EHooks>;
  }
}

/**
 * On in local development, and on builds where `NEXT_PUBLIC_E2E_HOOKS` is `"true"`, which is set for Vercel previews only.
 * Never set it for production: the hooks are harmless but are not part of the app.
 */
export const areE2EHooksEnabled = () =>
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_E2E_HOOKS === 'true';

/** Adds hooks to `window.__planetE2E` and returns a cleanup that removes only those, so parts of the map can add their own side by side. */
export const setE2EHooks = (hooks: Partial<E2EHooks>) => {
  window.__planetE2E = { ...window.__planetE2E, ...hooks };
  return () => {
    const current = { ...window.__planetE2E };
    for (const name of Object.keys(hooks) as (keyof E2EHooks)[]) {
      delete current[name];
    }
    if (Object.keys(current).length > 0) window.__planetE2E = current;
    else delete window.__planetE2E;
  };
};

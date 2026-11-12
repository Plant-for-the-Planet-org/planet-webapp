import { afterEach, describe, expect, it, vi } from 'vitest';

import { areE2EHooksEnabled, setE2EHooks } from './e2eHooks';

// Next inlines both values at build time, but under vitest they are ordinary runtime reads.
const build = (nodeEnv: string, e2eHooks?: string) => {
  vi.stubEnv('NODE_ENV', nodeEnv);
  vi.stubEnv('NEXT_PUBLIC_E2E_HOOKS', e2eHooks);
};

describe('areE2EHooksEnabled', () => {
  afterEach(() => {
    // restoreMocks in vitest.config.mts restores spies, not stubbed env vars.
    vi.unstubAllEnvs();
  });

  it('is off in a production build without NEXT_PUBLIC_E2E_HOOKS', () => {
    build('production');

    expect(areE2EHooksEnabled()).toBe(false);
  });

  it('is off in a production build when NEXT_PUBLIC_E2E_HOOKS is anything but "true"', () => {
    build('production', '1');

    expect(areE2EHooksEnabled()).toBe(false);
  });

  it('is on in a production build when NEXT_PUBLIC_E2E_HOOKS is "true", as on Vercel previews', () => {
    build('production', 'true');

    expect(areE2EHooksEnabled()).toBe(true);
  });

  it('is on in local development without NEXT_PUBLIC_E2E_HOOKS', () => {
    build('development');

    expect(areE2EHooksEnabled()).toBe(true);
  });
});

describe('setE2EHooks', () => {
  const getProjectMarkers = async () => null;
  const getProjectSites = async () => null;

  afterEach(() => {
    delete window.__planetE2E;
  });

  it('keeps hooks that another part of the map added', () => {
    setE2EHooks({ getProjectMarkers });
    setE2EHooks({ getProjectSites });

    expect(window.__planetE2E).toEqual({ getProjectMarkers, getProjectSites });
  });

  it('removes only its own hooks on cleanup', () => {
    setE2EHooks({ getProjectMarkers });
    const cleanup = setE2EHooks({ getProjectSites });

    cleanup();

    expect(window.__planetE2E).toEqual({ getProjectMarkers });
  });

  it('removes window.__planetE2E when the last hook goes', () => {
    const cleanup = setE2EHooks({ getProjectSites });

    cleanup();

    expect(window.__planetE2E).toBeUndefined();
  });
});

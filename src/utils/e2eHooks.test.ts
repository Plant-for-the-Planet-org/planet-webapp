import { afterEach, describe, expect, it, vi } from 'vitest';

import { areE2EHooksEnabled } from './e2eHooks';

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

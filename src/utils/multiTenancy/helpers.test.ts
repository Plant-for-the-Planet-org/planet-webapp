import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// redis-client builds a real Upstash client when REDIS_URL and REDIS_TOKEN are set, so without this the tests would hit the network on any machine that has them. null keeps them on the no-cache path.
vi.mock('../../redis-client', () => ({ default: null }));

// The module keeps an in-memory tenant-list cache at module scope, so each test resets modules and re-imports it fresh instead of sharing that cache (and its one-time fetch mock) across tests.
const importHelpers = () => import('./helpers');

const buildTenant = (overrides: Partial<Tenant['config']>): Tenant => ({
  id: overrides.slug ?? 'id',
  name: overrides.slug ?? 'name',
  image: null,
  tenantGoal: null,
  config: {
    appDomain: '',
    slug: 'planet',
    tenantURL: null,
    languages: ['en'],
    font: {
      primaryFontFamily: null,
      secondaryFontFamily: null,
      primaryFontURL: null,
      secondaryFontURL: null,
    },
    header: {
      isSecondaryTenant: false,
      tenantLogoURL: '',
      tenantLogoLink: '',
      items: [],
    },
    meta: {
      title: '',
      description: '',
      image: '',
      twitterHandle: '',
      locale: 'en',
    },
    footerLinks: [],
    manifest: '',
    ...overrides,
  },
});

const mockFetchWith = (tenants: Tenant[]) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(tenants),
    })
  );
};

describe('multiTenancy/helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    // The source interpolates this into the tenant API URL.
    vi.stubEnv('API_ENDPOINT', 'https://api.example.org');
  });

  // clearMocks and restoreMocks do not touch stubs, so the real fetch and env have to be put back by hand.
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  describe('getTenantSlug', () => {
    it('matches a tenant with a custom domain only through the custom domain', async () => {
      mockFetchWith([
        buildTenant({
          slug: 'acme',
          customDomain: 'https://acme.example.org',
          appDomain: 'https://acme.plant-for-the-planet.org',
        }),
      ]);
      const { getTenantSlug, DEFAULT_TENANT } = await importHelpers();

      await expect(getTenantSlug('acme.example.org')).resolves.toBe('acme');
      await expect(
        getTenantSlug('acme.plant-for-the-planet.org')
      ).resolves.toBe(DEFAULT_TENANT);
    });

    it('resolves a tenant by its app domain when there is no custom domain', async () => {
      mockFetchWith([
        buildTenant({
          slug: 'acme',
          appDomain: 'https://acme.plant-for-the-planet.org',
        }),
      ]);
      const { getTenantSlug } = await importHelpers();

      await expect(
        getTenantSlug('acme.plant-for-the-planet.org')
      ).resolves.toBe('acme');
    });

    it('falls back to the default tenant slug for an unrecognized host', async () => {
      mockFetchWith([
        buildTenant({ slug: 'acme', appDomain: 'https://acme.example.org' }),
      ]);
      const { getTenantSlug, DEFAULT_TENANT } = await importHelpers();

      await expect(getTenantSlug('unknown.example.org')).resolves.toBe(
        DEFAULT_TENANT
      );
    });

    it('does not fall through to appDomain when customDomain is malformed', async () => {
      // A parse failure counts as not matching, so the tenant is skipped rather than retried against its appDomain.
      mockFetchWith([
        buildTenant({
          slug: 'acme',
          customDomain: 'not-a-valid-url',
          appDomain: 'https://acme.example.org',
        }),
      ]);
      const { getTenantSlug, DEFAULT_TENANT } = await importHelpers();

      await expect(getTenantSlug('acme.example.org')).resolves.toBe(
        DEFAULT_TENANT
      );
    });
  });

  describe('getTenantConciseInfo', () => {
    it('returns the slug and supported languages for a matched tenant', async () => {
      mockFetchWith([
        buildTenant({
          slug: 'acme',
          appDomain: 'https://acme.example.org',
          languages: ['en', 'de'],
        }),
      ]);
      const { getTenantConciseInfo } = await importHelpers();

      await expect(getTenantConciseInfo('acme.example.org')).resolves.toEqual({
        slug: 'acme',
        supportedLanguages: ['en', 'de'],
      });
    });

    it('falls back to the default tenant languages for an unrecognized host', async () => {
      mockFetchWith([
        buildTenant({
          slug: 'planet',
          appDomain: 'https://planet.example.org',
          languages: ['en', 'fr'],
        }),
      ]);
      const { getTenantConciseInfo } = await importHelpers();

      await expect(
        getTenantConciseInfo('unknown.example.org')
      ).resolves.toEqual({
        slug: 'planet',
        supportedLanguages: ['en', 'fr'],
      });
    });

    it('falls back to slug "planet" and language "en" when the tenant list is empty', async () => {
      mockFetchWith([]);
      const { getTenantConciseInfo } = await importHelpers();

      await expect(
        getTenantConciseInfo('unknown.example.org')
      ).resolves.toEqual({
        slug: 'planet',
        supportedLanguages: ['en'],
      });
    });
  });

  describe('getTenantConfigList caching', () => {
    it('fetches the tenant list once and reuses it', async () => {
      mockFetchWith([
        buildTenant({ slug: 'acme', appDomain: 'https://acme.example.org' }),
      ]);
      const { getTenantConfigList } = await importHelpers();

      await getTenantConfigList();
      await getTenantConfigList();

      expect(fetch).toHaveBeenCalledExactlyOnceWith(
        'https://api.example.org/app/tenants?_scope=deployment'
      );
    });
  });

  describe('getTenantConfigList resilience', () => {
    it('returns an empty list instead of throwing when the tenant API request fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('network down'))
      );
      const { getTenantConfigList } = await importHelpers();

      await expect(getTenantConfigList()).resolves.toEqual([]);
    });

    it('returns an empty list instead of throwing on a non-2xx response', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: false, status: 500 })
      );
      const { getTenantConfigList } = await importHelpers();

      await expect(getTenantConfigList()).resolves.toEqual([]);
    });

    it('serves the last good list when a later refresh fails', async () => {
      const tenants = [
        buildTenant({ slug: 'acme', appDomain: 'https://acme.example.org' }),
      ];
      mockFetchWith(tenants);
      const { getTenantConfigList } = await importHelpers();

      await expect(getTenantConfigList()).resolves.toEqual(tenants);

      // The cached list is good for four hours, so the clock has to move past that before a second call will try to refresh at all.
      vi.useFakeTimers();
      vi.setSystemTime(Date.now() + 5 * 60 * 60 * 1000);
      const failingFetch = vi.fn().mockRejectedValue(new Error('network down'));
      vi.stubGlobal('fetch', failingFetch);

      await expect(getTenantConfigList()).resolves.toEqual(tenants);
      // Without this the test would also pass on an unexpired cache, which never reaches the stale-cache branch.
      expect(failingFetch).toHaveBeenCalledOnce();
    });
  });
});

import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The module keeps an in-memory tenant-list cache at module scope, so each
// test resets modules and re-imports it fresh instead of sharing that cache
// (and its one-time fetch mock) across tests.
const importHelpers = () => import('./helpers');

const buildTenant = (overrides: Partial<Tenant['config']>): Tenant =>
  ({
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
      header: { isSecondaryTenant: false, tenantLogoURL: '', tenantLogoLink: '', items: [] },
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
  }) as Tenant;

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
    vi.stubEnv('API_ENDPOINT', 'https://api.example.org');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe('getTenantSlug', () => {
    it('resolves a tenant by its custom domain', async () => {
      mockFetchWith([
        buildTenant({
          slug: 'acme',
          customDomain: 'https://acme.example.org',
          appDomain: 'https://acme.plant-for-the-planet.org',
        }),
      ]);
      const { getTenantSlug } = await importHelpers();

      await expect(getTenantSlug('acme.example.org')).resolves.toBe('acme');
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
      // A tenant with a set customDomain is matched only through it: a parse
      // failure returns false for that tenant outright, it does not fall back
      // to checking appDomain.
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

      await expect(
        getTenantConciseInfo('acme.example.org')
      ).resolves.toEqual({
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

  describe('getTenantConfigList resilience', () => {
    it('returns an empty list instead of throwing when the tenant API request fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
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
  });
});

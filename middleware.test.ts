import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import middleware from './middleware';
import { getTenantConciseInfo } from './src/utils/multiTenancy/helpers';

vi.mock('./src/utils/multiTenancy/helpers', () => ({
  getTenantConciseInfo: vi.fn(),
}));

const mockTenant = (
  slug: string,
  supportedLanguages: string[] = ['en', 'de', 'fr']
) =>
  vi.mocked(getTenantConciseInfo).mockResolvedValue({ slug, supportedLanguages });

const buildRequest = (
  path: string,
  { host = 'example.com', cookie }: { host?: string; cookie?: string } = {}
) =>
  new NextRequest(`https://${host}${path}`, {
    headers: {
      host,
      ...(cookie ? { cookie } : {}),
    },
  });

const redirectPathname = (res: Response) => {
  const location = res.headers.get('location');
  expect(location).not.toBeNull();
  return new URL(location as string);
};

const rewrittenPathname = (res: Response) => {
  const rewrite = res.headers.get('x-middleware-rewrite');
  expect(rewrite).not.toBeNull();
  return new URL(rewrite as string);
};

describe('middleware', () => {
  beforeEach(() => {
    mockTenant('acme');
  });

  describe('locale redirects', () => {
    it('redirects to the default locale when the path has none and nothing else is signalled', async () => {
      const res = await middleware(buildRequest('/'));

      expect(res.status).toBe(307);
      expect(redirectPathname(res).pathname).toBe('/en/');
    });

    it('preserves the query string across the locale redirect', async () => {
      const res = await middleware(buildRequest('/about?x=1'));

      const location = redirectPathname(res);
      expect(location.pathname).toBe('/en/about');
      expect(location.search).toBe('?x=1');
    });

    it('prefers the NEXT_LOCALE cookie over the negotiated language', async () => {
      const res = await middleware(
        buildRequest('/about', { cookie: 'NEXT_LOCALE=de' })
      );

      expect(redirectPathname(res).pathname).toBe('/de/about');
    });

    it('does not redirect when the path already carries a supported locale', async () => {
      const res = await middleware(buildRequest('/en/about'));

      expect(res.headers.get('location')).toBeNull();
    });

    it('restricts the locale choice to the languages the tenant supports', async () => {
      mockTenant('acme', ['de']);
      // The path already carries "en", but the tenant only supports "de", so
      // this still counts as locale-missing and gets redirected.
      const res = await middleware(buildRequest('/en/about'));

      expect(redirectPathname(res).pathname).toBe('/de/about');
    });
  });

  describe('hostname / tenant rewrites', () => {
    it('rewrites a locale-prefixed request under /sites/<tenant slug>', async () => {
      const res = await middleware(
        buildRequest('/en/about', { host: 'acme.example.org' })
      );

      expect(rewrittenPathname(res).pathname).toBe('/sites/acme/en/about');
    });

    it('resolves the tenant using the request host', async () => {
      await middleware(buildRequest('/en/about', { host: 'acme.example.org' }));

      expect(getTenantConciseInfo).toHaveBeenCalledWith('acme.example.org');
    });

    it('does not trigger the /sites canonical-access guard for a locale-prefixed path', async () => {
      // Documents current behavior: locale resolution runs first, so a path
      // that already carries a locale never falls into the "startsWith('/sites')"
      // guard below - it only ever sees paths of the form "/<locale>/sites/...",
      // which do not start with the literal string "/sites". The guard is
      // effectively unreachable through the normal request flow today.
      const res = await middleware(buildRequest('/en/sites/acme/about'));

      expect(rewrittenPathname(res).pathname).toBe(
        '/sites/acme/en/sites/acme/about'
      );
    });
  });

  describe('NEXT_LOCALE cookie', () => {
    it('sets the cookie to the resolved locale when none was set before', async () => {
      const res = await middleware(buildRequest('/en/about'));

      expect(res.cookies.get('NEXT_LOCALE')?.value).toBe('en');
    });

    it('updates the cookie when the path locale differs from the stored one', async () => {
      const res = await middleware(
        buildRequest('/de/about', { cookie: 'NEXT_LOCALE=en' })
      );

      expect(res.cookies.get('NEXT_LOCALE')?.value).toBe('de');
    });

    it('does not re-set the cookie when it already matches the path locale', async () => {
      const res = await middleware(
        buildRequest('/en/about', { cookie: 'NEXT_LOCALE=en' })
      );

      expect(res.cookies.get('NEXT_LOCALE')).toBeUndefined();
    });
  });
});

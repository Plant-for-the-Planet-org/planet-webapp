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
  vi
    .mocked(getTenantConciseInfo)
    .mockResolvedValue({ slug, supportedLanguages });

const buildRequest = (
  path: string,
  {
    host = 'example.com',
    cookie,
    acceptLanguage,
  }: { host?: string; cookie?: string; acceptLanguage?: string } = {}
) =>
  new NextRequest(`https://${host}${path}`, {
    headers: {
      host,
      ...(cookie ? { cookie } : {}),
      ...(acceptLanguage ? { 'accept-language': acceptLanguage } : {}),
    },
  });

const getRedirectUrl = (res: Response) => {
  const location = res.headers.get('location');
  expect(location).not.toBeNull();
  return new URL(location as string);
};

// x-middleware-rewrite is a Next internal convention, not a web standard, so a Next upgrade can rename it and break these tests without the rewrite logic changing.
const getRewrittenUrl = (res: Response) => {
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
      expect(getRedirectUrl(res).pathname).toBe('/en/');
    });

    it('preserves the query string across the locale redirect', async () => {
      const res = await middleware(buildRequest('/about?x=1'));

      const location = getRedirectUrl(res);
      expect(location.pathname).toBe('/en/about');
      expect(location.search).toBe('?x=1');
    });

    it('prefers the NEXT_LOCALE cookie over the negotiated language', async () => {
      const res = await middleware(
        buildRequest('/about', {
          cookie: 'NEXT_LOCALE=de',
          acceptLanguage: 'fr',
        })
      );

      expect(getRedirectUrl(res).pathname).toBe('/de/about');
    });

    it('does not redirect when the path already carries a supported locale', async () => {
      const res = await middleware(buildRequest('/en/about'));

      expect(res.headers.get('location')).toBeNull();
    });

    it('restricts the locale choice to the languages the tenant supports', async () => {
      mockTenant('acme', ['de']);
      // The path already carries "en", but the tenant only supports "de", so this still counts as locale-missing and gets redirected.
      const res = await middleware(buildRequest('/en/about'));

      expect(getRedirectUrl(res).pathname).toBe('/de/about');
    });
  });

  describe('hostname / tenant rewrites', () => {
    it('rewrites a locale-prefixed request under /sites/<tenant slug>', async () => {
      const res = await middleware(
        buildRequest('/en/about', { host: 'acme.example.org' })
      );

      expect(getRewrittenUrl(res).pathname).toBe('/sites/acme/en/about');
    });

    it('passes the request host into the tenant lookup', async () => {
      await middleware(buildRequest('/en/about', { host: 'acme.example.org' }));

      expect(getTenantConciseInfo).toHaveBeenCalledExactlyOnceWith(
        'acme.example.org'
      );
    });
  });

  describe('NEXT_LOCALE cookie', () => {
    it('does not set the cookie on the redirect hop for locale-less paths, only on the request that follows', async () => {
      const res = await middleware(buildRequest('/about'));

      expect(res.cookies.get('NEXT_LOCALE')).toBeUndefined();
    });

    it('sets the cookie to the path locale when no cookie was set before', async () => {
      const res = await middleware(buildRequest('/de/about'));

      expect(res.cookies.get('NEXT_LOCALE')).toMatchObject({
        value: 'de',
        path: '/',
        sameSite: 'lax',
        maxAge: 31536000,
        secure: true,
      });
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

  describe('known gaps, pinned but not approved', () => {
    // The /sites guard in middleware.ts is meant to block direct access to the internal path shape, but locale resolution redirects first so the guard's condition is never true. See #3137.
    it('lets a direct /sites request through the guard (#3137)', async () => {
      const res = await middleware(buildRequest('/sites/acme/about'));

      expect(getRedirectUrl(res).pathname).toBe('/en/sites/acme/about');
    });
  });
});

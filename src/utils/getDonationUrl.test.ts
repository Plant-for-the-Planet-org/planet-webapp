import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getDonationUrl } from './getDonationUrl';

const DONATION_URL = 'https://donate.example.org';

const queryOf = (url: string) => new URL(url).searchParams;

const storeDirectGift = (value: unknown) =>
  localStorage.setItem(
    'directGift',
    typeof value === 'string' ? value : JSON.stringify(value)
  );

// jsdom refuses assignment to window.location, so navigate instead. This sets location.href for real.
const setCurrentUrl = (path: string) =>
  window.history.replaceState({}, '', path);

describe('getDonationUrl', () => {
  beforeEach(() => {
    localStorage.clear();
    setCurrentUrl('/');
    // NEXT_PUBLIC_ vars are inlined at build time by Next, but under vitest this is an ordinary runtime read.
    vi.stubEnv('NEXT_PUBLIC_DONATION_URL', DONATION_URL);
  });

  afterEach(() => {
    // restoreMocks in vitest.config.mts restores spies, not stubbed env vars.
    vi.unstubAllEnvs();
  });

  describe('country and locale', () => {
    it('falls back to DE and en when localStorage is empty', () => {
      const query = queryOf(getDonationUrl(undefined, 'project-1', null));

      expect(query.get('country')).toBe('DE');
      expect(query.get('locale')).toBe('en');
    });

    it('uses the stored country and language when present', () => {
      localStorage.setItem('countryCode', 'IN');
      localStorage.setItem('language', 'de');

      const query = queryOf(getDonationUrl(undefined, 'project-1', null));

      expect(query.get('country')).toBe('IN');
      expect(query.get('locale')).toBe('de');
    });
  });

  describe('callback_url', () => {
    it('keeps a callback url carrying its own query string as a single param', () => {
      const callbackUrl = 'https://host.example/page?ref=abc&utm_source=news';

      const query = queryOf(
        getDonationUrl(undefined, 'project-1', null, 'true', callbackUrl)
      );

      expect(query.get('callback_url')).toBe(callbackUrl);
      // The callback's own params must not surface as params of the donation url.
      expect(query.get('ref')).toBeNull();
      expect(query.get('utm_source')).toBeNull();
    });

    it('does not let a callback url override another param', () => {
      const query = queryOf(
        getDonationUrl(
          'real-tenant',
          'project-1',
          null,
          'true',
          'https://host.example/page?tenant=spoofed&token=spoofed'
        )
      );

      expect(query.get('tenant')).toBe('real-tenant');
      expect(query.get('token')).toBeNull();
      expect(query.getAll('tenant')).toHaveLength(1);
    });

    it('uses the passed callback url in embed mode', () => {
      setCurrentUrl('/current-page');

      const query = queryOf(
        getDonationUrl(
          undefined,
          'project-1',
          null,
          'true',
          'https://host.example/embedded'
        )
      );

      expect(query.get('callback_url')).toBe('https://host.example/embedded');
    });

    it('uses the current page url when not in embed mode', () => {
      setCurrentUrl('/current-page');

      const query = queryOf(
        getDonationUrl(
          undefined,
          'project-1',
          null,
          undefined,
          'https://host.example/embedded'
        )
      );

      expect(query.get('callback_url')).toBe(window.location.href);
      expect(query.get('callback_url')).toContain('/current-page');
    });

    it('omits the param in embed mode when no callback url is given', () => {
      const query = queryOf(
        getDonationUrl(undefined, 'project-1', null, 'true', undefined)
      );

      expect(query.has('callback_url')).toBe(false);
    });
  });

  describe('the s param', () => {
    it('prefers the stored direct gift id over the slug', () => {
      storeDirectGift({ id: 'gift-1' });

      const query = queryOf(
        getDonationUrl(
          undefined,
          'project-1',
          null,
          undefined,
          undefined,
          'slug-1'
        )
      );

      expect(query.get('s')).toBe('gift-1');
    });

    it('uses the slug when the stored direct gift has no id', () => {
      storeDirectGift({ recipientName: 'Someone' });

      const query = queryOf(
        getDonationUrl(
          undefined,
          'project-1',
          null,
          undefined,
          undefined,
          'slug-1'
        )
      );

      expect(query.get('s')).toBe('slug-1');
    });

    it('uses the slug when there is no stored direct gift', () => {
      const query = queryOf(
        getDonationUrl(
          undefined,
          'project-1',
          null,
          undefined,
          undefined,
          'slug-1'
        )
      );

      expect(query.get('s')).toBe('slug-1');
    });

    it('omits the param when there is neither a direct gift nor a slug', () => {
      const query = queryOf(getDonationUrl(undefined, 'project-1', null));

      expect(query.has('s')).toBe(false);
    });

    it('returns a url instead of throwing when the stored direct gift is malformed', () => {
      storeDirectGift('not json');

      expect(() =>
        getDonationUrl(
          undefined,
          'project-1',
          null,
          undefined,
          undefined,
          'slug-1'
        )
      ).not.toThrow();
      expect(
        queryOf(
          getDonationUrl(
            undefined,
            'project-1',
            null,
            undefined,
            undefined,
            'slug-1'
          )
        ).get('s')
      ).toBe('slug-1');
    });
  });

  describe('optional params', () => {
    it('omits token, tenant and utm_campaign when they are absent', () => {
      const query = queryOf(getDonationUrl(undefined, 'project-1', null));

      expect(query.has('token')).toBe(false);
      expect(query.has('tenant')).toBe(false);
      expect(query.has('utm_campaign')).toBe(false);
    });

    it('includes token, tenant and utm_campaign when they are given', () => {
      const query = queryOf(
        getDonationUrl(
          'ten-1',
          'project-1',
          'tok-1',
          undefined,
          undefined,
          undefined,
          'camp-1'
        )
      );

      expect(query.get('token')).toBe('tok-1');
      expect(query.get('tenant')).toBe('ten-1');
      expect(query.get('utm_campaign')).toBe('camp-1');
    });

    it('encodes reserved characters in a value', () => {
      const query = queryOf(
        getDonationUrl('ten&1', 'project 1', null, undefined, undefined, 'a=b')
      );

      expect(query.get('to')).toBe('project 1');
      expect(query.get('tenant')).toBe('ten&1');
      expect(query.get('s')).toBe('a=b');
    });
  });

  // Pins the exact output, so a future refactor of the url composition is provable by a green run.
  it('composes the full url in a fixed param order', () => {
    localStorage.setItem('countryCode', 'IN');
    localStorage.setItem('language', 'de');

    expect(
      getDonationUrl(
        'ten-1',
        'project-1',
        'tok-1',
        'true',
        'https://host.example/page',
        'slug-1',
        'camp-1'
      )
    ).toBe(
      `${DONATION_URL}/?to=project-1&callback_url=https%3A%2F%2Fhost.example%2Fpage&country=IN&locale=de&token=tok-1&tenant=ten-1&s=slug-1&utm_campaign=camp-1`
    );
  });
});

import { useLocale } from 'next-intl';
import { useRouter } from 'next/router';
import { getLocalizedPath } from '../utils/getLocalizedPath';

export type NavigationOptions = {
  shallow?: boolean;
  scroll?: boolean;
  locale?: string | false;
  unstable_skipClientCache?: boolean;
};

interface LocalizedRouter {
  push: (
    href: string,
    asPath?: string,
    options?: NavigationOptions,
    locale?: string
  ) => Promise<boolean>;
  replace: (
    href: string,
    asPath?: string,
    options?: NavigationOptions,
    locale?: string
  ) => Promise<boolean>;
  getPath: (path: string, locale?: string) => string;
  currentLocale: string;
}

/**
 * Custom hook for locale-aware client-side navigation.
 *
 * Provides localized `push`, `replace`, and `getPath` helpers,
 * ensuring correct locale handling for both static and dynamic routes.
 *
 * @returns LocalizedRouter object with navigation utilities.
 */
function useLocalizedRouter(): LocalizedRouter {
  const router = useRouter();
  const currentLocale = useLocale();

  const localizedNavigate = (
    method: 'push' | 'replace',
    href: string,
    asPath?: string,
    options: NavigationOptions = {},
    locale?: string
  ) => {
    const effectiveLocale = locale || currentLocale;

    if (asPath) {
      // Case 1: Dynamic route → localize only the "as" path
      const localizedAs = getLocalizedPath(asPath, effectiveLocale);
      return router[method](href, localizedAs, { ...options });
    }

    // Case 2: Static route → localize the href directly
    const localizedHref = getLocalizedPath(href, effectiveLocale);
    return router[method](localizedHref, undefined, { ...options });
  };

  const getPath = (path: string, locale?: string) =>
    getLocalizedPath(path, locale || currentLocale);

  const push = (
    href: string,
    asPath?: string,
    options?: NavigationOptions,
    locale?: string
  ) => localizedNavigate('push', href, asPath, options, locale);

  const replace = (
    href: string,
    asPath?: string,
    options?: NavigationOptions,
    locale?: string
  ) => localizedNavigate('replace', href, asPath, options, locale);

  return {
    push,
    replace,
    getPath,
    currentLocale,
  };
}

export default useLocalizedRouter;

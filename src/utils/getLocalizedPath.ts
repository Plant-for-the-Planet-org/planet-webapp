import type { Locale } from '../../i18n-config';

import { i18nConfig } from '../../i18n-config';

/**
 * Normalize a locale string to a canonical format.
 *
 * Examples:
 *  - "en" → "en"
 *  - "en-us" → "en-US"
 *
 * @param locale - The raw locale string.
 * @returns The normalized locale string.
 */
function normalizeLocale(locale: string): string {
  const parts = locale.split('-');
  if (parts.length === 1) return parts[0].toLowerCase();
  if (parts.length === 2)
    return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
  return locale;
}

/**
 * Check if the provided locale is supported by the app.
 *
 * @param locale - The locale string to check.
 * @returns True if the locale is supported; otherwise false.
 */
function isSupportedLocale(locale: string): locale is Locale {
  return i18nConfig.locales.includes(normalizeLocale(locale) as Locale);
}

/**
 * Remove the locale segment from the beginning of a pathname,
 * while preserving query strings and hash fragments.
 *
 * Examples:
 *  - "/en/about" → "/about"
 *  - "/de" → "/"
 *  - "/en/about?tab=true" → "/about?tab=true"
 *  - "/fr/contact#section1" → "/contact#section1"
 *
 * @param pathname - The pathname that may include a locale prefix,
 *   query string, and/or hash fragment.
 * @returns The pathname without the locale prefix, preserving any query
 *   string and hash fragment.
 */

export function removeLocaleFromPath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const match = normalizedPath.match(/^([^?#]*)([?#].*)?$/);
  const base = match?.[1] ?? normalizedPath;
  const suffix = match?.[2] ?? '';
  const segments = base.split('/').filter(Boolean);

  if (segments.length === 0) return `/${suffix}`;
  const hasLocaleSegment = isSupportedLocale(segments[0]);

  if (hasLocaleSegment) {
    const remainingSegments = segments.slice(1);
    const pathWithoutLocale =
      remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/';
    return `${pathWithoutLocale}${suffix}`;
  }

  return normalizedPath;
}

/**
 * Build a localized path with the given locale.
 *
 * This function first removes any existing locale from the path,
 * then prepends the correct locale segment.
 *
 * @param path - The original pathname (may include locale).
 * @param locale - The desired locale string.
 * @returns The localized pathname.
 */
export function getLocalizedPath(path: string, locale: string): string {
  // Remove any existing locale from path (defensive programming)
  const pathWithoutLocale = removeLocaleFromPath(path);
  const inputLocale = locale.trim();
  let effectiveLocale = inputLocale
    ? normalizeLocale(inputLocale)
    : i18nConfig.defaultLocale;

  if (!isSupportedLocale(effectiveLocale)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `Invalid locale "${locale}". Falling back to default locale "${i18nConfig.defaultLocale}".`
      );
    }
    effectiveLocale = i18nConfig.defaultLocale;
  }

  if (pathWithoutLocale === '/') return `/${effectiveLocale}`;

  return `/${effectiveLocale}${pathWithoutLocale}`;
}

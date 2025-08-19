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
 * Remove the locale segment from the beginning of a pathname.
 *
 * Examples:
 *  - "/en/about" → "/about"
 *  - "/de" → "/"
 *
 * @param pathname - The pathname with or without a locale prefix.
 * @returns The pathname without the locale prefix.
 */
function removeLocaleFromPath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = normalizedPath.split('/').filter(Boolean);

  if (segments.length === 0) return '/';
  const hasLocaleSegment = isSupportedLocale(segments[0]);

  if (hasLocaleSegment) {
    const remainingSegments = segments.slice(1);
    const pathWithoutLocale =
      remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/';
    return pathWithoutLocale;
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

  let effectiveLocale = locale.trim() || i18nConfig.defaultLocale;
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

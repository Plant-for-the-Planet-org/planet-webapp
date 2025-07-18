/**
 * Returns a localized path by prepending the specified locale to the given path.
 *
 * Ensures the path starts with a slash and then prefixes it with `/${locale}`.
 *
 * @param {string} path - The URL path to localize (e.g., "/about", "contact").
 * @param {string} locale - The locale to prepend (e.g., "en", "de").
 * @returns {string} The localized path (e.g., "/en/about", "/de/contact").
 *
 * @example
 * getLocalizedPath('/about', 'en'); // returns '/en/about'
 * getLocalizedPath('contact', 'de'); // returns '/de/contact'
 */

function getLocalizedPath(path: string, locale: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `/${locale}${normalizedPath}`;
}

export default getLocalizedPath;

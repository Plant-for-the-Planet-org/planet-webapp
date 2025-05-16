/**
 * Custom hook to detect if the viewport width is below the specified maxWidth.
 *
 * This hook uses `window.matchMedia` to check for a max-width media query and listens for changes
 * in the viewport width. It invokes the provided callback with a boolean value indicating whether
 * the viewport is currently below or above the specified maxWidth.
 *
 * @param {string} maxWidth - The max width for the mobile detection media query (e.g., '768px').
 * @param {Function} callback - A callback function that receives a boolean indicating whether
 * the current viewport matches the media query (true for mobile view, false for desktop view).
 *
 * @returns {Function} A cleanup function to remove the event listener when no longer needed.
 */

export const useMobileDetection = (
  maxWidth: string,
  callback: (value: boolean) => void
) => {
  const mediaQuery = window.matchMedia(`(max-width:${maxWidth} )`);
  const handleResize = () => {
    callback(mediaQuery.matches);
  };
  handleResize();
  mediaQuery.addEventListener('change', handleResize);
  return () => {
    mediaQuery.removeEventListener('change', handleResize);
  };
};

const PLANET_DOMAINS = [
  'www.plant-for-the-planet.org',
  'donate.plant-for-the-planet.org',
];

const supportedLocales = ['en', 'de', 'cs', 'es', 'fr', 'it', 'pt-BR'];

/**
 * Removes any supported locale segments from the provided URL path segments.
 *
 * @param segments - An array of path segments extracted from the URL pathname.
 * @param hasTrailingSlash - A boolean indicating if the original pathname ended with a slash.
 * @returns The cleaned pathname with supported locale segments removed and the original trailing slash preserved if applicable.
 */

const removeHardcodedLocale = (
  segments: string[],
  hasTrailingSlash: boolean
) => {
  const filteredSegments = segments.filter(
    (s) => !supportedLocales.includes(s)
  );

  const cleaned = '/' + filteredSegments.join('/');
  return hasTrailingSlash && cleaned !== '/' ? cleaned + '/' : cleaned;
};

/**
 * Adds the specified locale to the given URL's pathname.
 * If the URL already contains a supported locale segment, it will be replaced with the new locale.
 *
 * @param url - The original URL as a string.
 * @param locale - The locale to be added to the URL's pathname.
 * @returns The updated URL as a string with the specified locale included in the pathname.
 * @throws Will throw an error if the provided URL is invalid.
 */

export const addLocaleToUrl = (url: string, locale: string): string => {
  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    const hasTrailingSlash = parsedUrl.pathname.endsWith('/');

    // If  locale is present, remove it
    const hasLocale = segments.some((s) => supportedLocales.includes(s));
    const cleanedPathname = hasLocale
      ? removeHardcodedLocale(segments, hasTrailingSlash)
      : parsedUrl.pathname;

    // Add new locale prefix
    parsedUrl.pathname = `/${locale}${cleanedPathname}`;
    return parsedUrl.toString();
  } catch {
    console.error(`Invalid URL: ${url}`);
    return url;
  }
};

/**
 * Checks if a given URL belongs to the 'www.plant-for-the-planet.org' or 'donate.plant-for-the-planet.org'  domain.
 *
 * @param url - The URL to check
 * @returns True if the URL is from the official domain, false otherwise
 */

export const isPlanetDomain = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return PLANET_DOMAINS.includes(hostname);
  } catch {
    return false;
  }
};

/**
 * Removes the `/sites/[slug]/[locale]` prefix from a pathname.
 *
 * @param pathname - The pathname to process
 * @returns The pathname with the prefix removed
 */

export const stripSitesSlugLocale = (pathname: string) =>
  pathname.replace(/^\/sites\/\[slug\]\/\[locale\]/, '');

/**
 * Compares a given link with the current pathname,
 * after removing the `/sites/[slug]/[locale]` prefix from the pathname.
 *
 * @param link - The link to compare against (e.g. `/about`)
 * @param pathname - The current full pathname (e.g. `/sites/[slug]/[locale]/about`)
 * @returns `true` if the link matches the stripped pathname, otherwise `false`.
 */

export const doesLinkMatchPath = (
  link: string | undefined,
  pathname: string
): boolean => {
  const strippedPathname = stripSitesSlugLocale(pathname) || '/';

  if (strippedPathname === link) return true;
  return false;
};

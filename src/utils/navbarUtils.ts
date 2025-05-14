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

const PLANET_WORD_PRESS_DOMAIN = 'www.plant-for-the-planet.org';
const PLANET_DONATION_DOMAIN = 'donate.plant-for-the-planet.org';
/**
 * Adds a locale path segment to a given Plant-for-the-Planet URL.
 *
 * Example:
 *   Input: 'https://www.plant-for-the-planet.org/some-page', 'de'
 *   Output: 'https://www.plant-for-the-planet.org/de/some-page'
 *
 * @param url - The original URL
 * @param locale - The locale string to insert into the URL
 * @returns The updated URL with the locale inserted
 */
export const addLocaleToUrl = (url: string, locale: string): string => {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.pathname = `/${locale}${parsedUrl.pathname}`;
    return parsedUrl.toString();
  } catch {
    throw new Error(`Invalid URL: ${url}`);
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
    return (
      hostname === PLANET_WORD_PRESS_DOMAIN ||
      hostname === PLANET_DONATION_DOMAIN
    );
  } catch {
    return false;
  }
};

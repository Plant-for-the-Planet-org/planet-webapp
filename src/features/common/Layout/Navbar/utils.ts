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

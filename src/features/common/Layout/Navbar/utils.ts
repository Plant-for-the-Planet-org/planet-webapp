const PLANET_WORD_PRESS_DOMAIN = 'www.plant-for-the-planet.org';
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
export const addLocaleToUrl = (url: string, locale: string): string =>
  url.replace(
    PLANET_WORD_PRESS_DOMAIN,
    `${PLANET_WORD_PRESS_DOMAIN}/${locale}`
  );

/**
 * Checks if a given URL belongs to the 'www.plant-for-the-planet.org' domain.
 *
 * @param url - The URL to check
 * @returns True if the URL is from the official domain, false otherwise
 */

export const isPlanetDomain = (url: string) => {
  try {
    return new URL(url).hostname === PLANET_WORD_PRESS_DOMAIN;
  } catch {
    return false;
  }
};

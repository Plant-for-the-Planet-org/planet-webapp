/**
 * Checks if a given URL is an absolute URL.
 *
 * @param url - The URL to check
 * @returns Boolean indicating if the URL is absolute
 *
 * @example
 * isAbsoluteUrl('https://api.example.com') // returns true
 * isAbsoluteUrl('/users') // returns false
 */
function isAbsoluteUrl(url: string) {
  const pattern = /^https?:\/\//i;
  return pattern.test(url);
}

export default isAbsoluteUrl;

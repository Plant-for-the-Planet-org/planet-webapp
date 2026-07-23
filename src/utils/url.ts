/**
 * Returns whether a URL should be treated as external.
 *
 * External URLs include:
 * - Protocol-relative URLs (`//example.com`)
 * - Non-HTTP(S) schemes (`mailto:`, `tel:`, etc.)
 * - HTTP(S) URLs pointing to a different host
 *
 * Same-host HTTP(S) URLs and relative paths are treated as internal.
 *
 * @param url - URL to check
 * @returns `true` if the URL is external, otherwise `false`
 */
export function isExternalUrl(url: string): boolean {
  try {
    // Protocol-relative URLs always resolve to another origin's scheme.
    if (url.startsWith('//')) return true;

    // Without an explicit scheme it is a relative path -> internal.
    const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(url);
    if (!hasScheme) return false;

    // http(s): same host is internal, a different host is external.
    if (/^https?:\/\//i.test(url)) {
      return new URL(url).host !== window.location.host;
    }

    // Any other scheme (mailto:, tel:, ...) is external.
    return true;
  } catch {
    return false;
  }
}

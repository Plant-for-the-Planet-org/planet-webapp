// Matches a URL that begins with an explicit scheme (RFC 3986): ALPHA *( ALPHA / DIGIT / "+" / "-" / "." ) followed by ":".
const URL_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i;

/**
 * Returns whether a URL should be treated as external.
 *
 * External URLs are any value with an explicit scheme (`http(s):`, `mailto:`,`tel:`, ...) or a protocol-relative URL (`//example.com`). A scheme-less value is a relative internal path.
 *
 * This is intentionally deterministic — it does not read `window`/the current host - so it returns the same result during SSR and on the client. Components that branch on it (e.g. `<a>` vs localized `<Link>`) therefore render the same markup on both, avoiding hydration mismatches. Internal links in this app are relative paths, so absolute URLs are always treated as external.
 *
 * @param url - URL to check
 * @returns `true` if the URL is external, otherwise `false`
 */
export function isExternalUrl(url: string): boolean {
  // Protocol-relative URLs resolve to another origin.
  if (url.startsWith('//')) return true;

  // Any explicit scheme (http(s), mailto, tel, ...) is external; a scheme-less value is a relative internal path.
  return URL_SCHEME_PATTERN.test(url);
}

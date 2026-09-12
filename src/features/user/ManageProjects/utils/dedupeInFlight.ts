/**
 * Collapses concurrent identical requests into one.
 *
 * Module scope on purpose. A `useRef` guard cannot help here: the project form
 * mounts more than once per navigation, and each mount gets its own refs, so
 * both mounts issue the same request. Keying at module level is what makes the
 * second one a no-op.
 *
 * This is deliberately not a cache. The entry is dropped as soon as the request
 * settles, so a later load always fetches fresh data — important for project
 * details, which change whenever a section is saved.
 */
const inFlight = new Map<string, Promise<unknown>>();

export function dedupeInFlight<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const pending = inFlight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const request = fetcher().finally(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, request);

  return request;
}

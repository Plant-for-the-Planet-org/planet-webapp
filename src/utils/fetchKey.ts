/**
 * Helpers for de-duplicating store fetches.
 *
 * A fetch key records the conditions a response depends on, so a store can tell
 * whether a request would return what it already holds. Stores keep two of them:
 * one for the request in flight, one for the last successful fetch. Two are
 * needed because a boolean `isFetching` flag says that a request is running, not
 * which one, so it cannot distinguish a duplicate call from a legitimate fetch
 * for different conditions.
 */

/** Conditions a fetched response depends on. Values are compared with `===`. */
export type FetchKey = Record<string, string>;

/**
 * Whether `a` records the same conditions as `b`. A `null` `a` means nothing has
 * been fetched, or nothing is in flight, and never matches.
 */
export const isSameFetchKey = <T extends FetchKey>(
  a: T | null,
  b: T
): boolean =>
  a !== null && (Object.keys(b) as Array<keyof T>).every((k) => a[k] === b[k]);

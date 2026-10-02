/**
 * Base URL for public fundraiser pages (Start Planting).
 * A fundraiser page lives at `${FUNDRAISER_URL}/raise/{slug ?? guid}`.
 * Kept as an in-app constant for now; promote to an env var if it needs to
 * differ per environment.
 */
export const FUNDRAISER_URL = 'https://startplanting.org';

/** Build the public URL for a fundraiser from its slug or guid. */
export const getFundraiserUrl = (slugOrGuid: string): string =>
  `${FUNDRAISER_URL}/raise/${slugOrGuid}`;

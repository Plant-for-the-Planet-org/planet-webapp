/**
 * Selectable years for project-site dates, newest first.
 *
 * Bounded rather than free numeric entry: these were plain number inputs, which
 * accepted anything and made typos (1023, 2202) indistinguishable from real
 * answers. 1950 is the agreed lower bound; the upper bound tracks the current
 * year so it never needs revisiting.
 */
export const EARLIEST_SITE_YEAR = 1950;

export function getSiteYearOptions(
  latestYear: number = new Date().getFullYear()
): number[] {
  const years: number[] = [];
  for (let year = latestYear; year >= EARLIEST_SITE_YEAR; year--) {
    years.push(year);
  }
  return years;
}

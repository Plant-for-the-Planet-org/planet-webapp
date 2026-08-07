import type { Global } from './types';

import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';

/**
 * Formats a numeric statistic using localized abbreviation rules.
 *
 * - Values below 1,000,000 are formatted with no decimal places.
 * - Values >= 1,000,000 are formatted with one decimal place.
 *
 * @param value - The numeric value to format.
 * @param locale - The locale string used for number formatting (e.g., "en", "de").
 * @returns A localized, abbreviated number string.
 */

export const formatStatNumber = (value: number, locale: string): string => {
  const rounded = Math.floor(value);

  return rounded < 1000000
    ? localizedAbbreviatedNumber(locale, rounded, 0)
    : localizedAbbreviatedNumber(locale, rounded, 1);
};

// Helper: format Date to 'YYYY-MM-DD' string
export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Validates a date range.
 *
 * Rules:
 * - If both dates are null → valid.
 * - If both dates are provided → `fromDate` must be less than or equal to `toDate`.
 * - If only one date is provided → invalid.
 *
 * @param fromDate - The start date (nullable).
 * @param toDate - The end date (nullable).
 * @returns True if the range is valid, otherwise false.
 */
export const isValidRange = (fromDate: Date | null, toDate: Date | null) => {
  if (!fromDate && !toDate) return true; // both missing → valid
  if (fromDate && toDate) {
    return fromDate.getTime() <= toDate.getTime();
  } // both present → validate
  return false; // only one present → invalid
};

/**
 * Determines whether tenant statistics contain only zero values.
 *
 * Used to detect empty dashboard states.
 *
 * @param stats - The global tenant statistics object.
 * @returns True if all tracked metrics are zero, otherwise false.
 */

export const isDataEmpty = (stats: Global) => {
  return (
    stats.totalPlanted === 0 &&
    stats.totalRestored === 0 &&
    stats.totalDonated === 0 &&
    stats.uniqueDonors === 0 &&
    stats.countries === 0
  );
};

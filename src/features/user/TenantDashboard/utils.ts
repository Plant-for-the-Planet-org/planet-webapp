import type { Global } from '.';

import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';

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

export const isValidRange = (fromDate: Date | null, toDate: Date | null) => {
  if (!fromDate && !toDate) return true; // both missing → valid
  if (fromDate && toDate) {
    return fromDate.getTime() <= toDate.getTime();
  } // both present → validate
  return false; // only one present → invalid
};

export const isDataEmpty = (stats: Global) => {
  return (
    stats.totalPlanted === 0 &&
    stats.totalRestored === 0 &&
    stats.totalDonated === 0 &&
    stats.uniqueDonors === 0 &&
    stats.countries === 0
  );
};

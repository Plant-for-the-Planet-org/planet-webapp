import { localizedAbbreviatedNumber } from '../../../utils/getFormattedNumber';

export const formatStatNumber = (value: number, locale: string): string => {
  if (value === null || value === undefined) return '0';

  const rounded = Math.floor(value);

  return rounded < 1000000
    ? localizedAbbreviatedNumber(locale, rounded, 0)
    : localizedAbbreviatedNumber(locale, rounded, 1);
};

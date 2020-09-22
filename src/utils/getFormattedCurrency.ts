import { getCountryDataBy } from './countryUtils';

export default function getFormatedCurrency(
  countryCode: string,
  currency: string,
  number: number
) {
  let langCode = getCountryDataBy('countryCode', countryCode).languageCode;
  const formatter = new Intl.NumberFormat(langCode + '-' + countryCode, {
    style: 'currency',
    currency: currency,

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(number);
}

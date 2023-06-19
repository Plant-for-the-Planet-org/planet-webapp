/**
 * Retrieves the currency symbol for a given number.
 * @param {string} langCode - The language code.
 * @param {string} currency - The currency code.
 * @param {number} number - The number used to determine the currency symbol.
 */

export default function getCurrencySymbolByCode(
  langCode: string,
  currency: string,
  number: number
) {
  const options = {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...(currency ? { style: 'currency', currency: currency } : {}),
  };
  const formatter = new Intl.NumberFormat(langCode, options);
  const currencySymbol = formatter
    .formatToParts(number)
    .filter((part) => part.type == 'currency');

  return Array.isArray(currencySymbol) && currencySymbol.length > 0
    ? currencySymbol[0].value
    : null;
}

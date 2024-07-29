/**
 * Retrieves the appropriate currency symbol for a given currency and amount.
 * @param {string} langCode - The language code.
 * @param {string} currency - The currency code.
 * @param {amount} number - The amount/value in the specified currency
 */

export default function getCurrencySymbolByCode(
  langCode: string,
  currency: string,
  amount: number
) {
  const options = {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...(currency ? { style: 'currency', currency: currency } : {}),
  };
  const formatter = new Intl.NumberFormat(langCode, options);
  const currencySymbol = formatter
    .formatToParts(amount)
    .filter((part) => part.type === 'currency');

  return Array.isArray(currencySymbol) && currencySymbol.length > 0
    ? currencySymbol[0].value
    : null;
}

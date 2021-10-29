export default function getCurrencySymbolByCode(
  langCode: string,
  currency: string,
  number: number
) {
  let options = {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (currency) {
    options = {
      style: 'currency',
      currency: currency,
      ...options,
    };
  }
  const formatter = new Intl.NumberFormat(langCode, options);
  const currencySymbol = formatter
    .formatToParts(number)
    .filter((part) => part.type == 'currency');

  return Array.isArray(currencySymbol) && currencySymbol.length > 0
    ? currencySymbol[0].value
    : null;
}

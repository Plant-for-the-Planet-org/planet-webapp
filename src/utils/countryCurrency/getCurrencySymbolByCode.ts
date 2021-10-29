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
  return formatter
    .formatToParts(number)
    .filter((part) => part.type == 'currency')[0].value;
}

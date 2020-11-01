export default function getFormatedCurrency(
  langCode: string,
  currency: string,
  number: number
) {
  const formatter = new Intl.NumberFormat(langCode, {
    style: 'currency',
    currency: currency,

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(number);
}

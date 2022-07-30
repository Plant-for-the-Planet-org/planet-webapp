export default function getFormatedCurrency(
  langCode: string,
  currency: string,
  number: number
): string {
  const options = {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...(currency
      ? {
          style: 'currency',
          currency: currency,
        }
      : {}),
  };

  const formatter = new Intl.NumberFormat(langCode, options);
  return formatter.format(number);
}

export default function getFormattedCurrency(
  langCode: string,
  currency: string,
  number: number,
  isInteger?: boolean
): string {
  const options = {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: isInteger ? 0 : 2,
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

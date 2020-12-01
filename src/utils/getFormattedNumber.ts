export function getFormattedRoundedNumber(
  langCode: string,
  number: number
) {
  const formatter = new Intl.NumberFormat(langCode, {
    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(number);
}

export default function getFormattedNumber(
  langCode: string,
  number: number
) {
  const formatter = new Intl.NumberFormat(langCode);
  return formatter.format(number);
}


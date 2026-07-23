/**
 * Formats an ISO date for the donor's current locale — "17. Juli 2026" for de,
 * "July 17, 2026" for en, "17 de julio de 2026" for es, etc. Uses
 * Intl.DateTimeFormat so both the day/month order and the month name follow the
 * locale. This intentionally does NOT use the shared getFormattedDate, which
 * keys off a localStorage `language` (not the route locale) and a fixed
 * US-order format, so a directly-opened /de link would otherwise show English
 * dates. Returns '' for missing or invalid input.
 */
export const formatPaymentDate = (
  iso: string | null | undefined,
  locale: string
): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
};

/**
 * Returns a `YYYY-MM-DD` string for a native `<input type="date">` value/min,
 * from an ISO date (optionally offset by whole days). Empty string for
 * missing/invalid input. This is the same date-only shape the /app/subscriptions
 * payloads expect, so the input value can be sent through unchanged.
 */
export const toDateInputValue = (
  iso: string | null | undefined,
  addDays = 0
): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  date.setUTCDate(date.getUTCDate() + addDays);
  return date.toISOString().split('T')[0];
};

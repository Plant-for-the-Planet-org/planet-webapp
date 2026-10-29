import type { SavedPaymentMethod } from '../types';

export interface ExpiryInfo {
  /** "MM/YY", or null when the method has no (readable) expiry. */
  date: string | null;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export interface SepaCreditor {
  name: string;
  id: string;
}

// A card counts as "expiring soon" within 60 days of the end of its expiry month, so recurring donors have time to replace it before a charge fails.
const EXPIRING_SOON_WINDOW_MS = 60 * 24 * 60 * 60 * 1000;

const PLANET_FOUNDATION_CREDITOR: SepaCreditor = {
  name: 'Plant-for-the-Planet Foundation',
  id: 'DE94ZZZ00000023303',
};

const PLANET_ESPANA_CREDITOR: SepaCreditor = {
  name: 'Fundación Plant-for-the-Planet España',
  id: 'ES34000G54754031',
};

export const isSepaMethod = (method: SavedPaymentMethod) =>
  method.type === 'sepa_debit' || method.brand === 'sepa';

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Reads the platform's "expires" value (e.g. "1/2027") as MM/YY and flags expired and soon-to-expire cards.
 * A card stays valid through the last day of its expiry month, the convention Stripe and the card networks use.
 */
export const getExpiryInfo = (
  expires: string | null | undefined,
  now: number = Date.now()
): ExpiryInfo => {
  const fallback = { date: null, isExpired: false, isExpiringSoon: false };
  if (!expires) return fallback;

  const match = /^(\d{1,2})\/(\d{2,4})$/.exec(expires.trim());
  if (!match) return fallback;

  const [, monthStr, yearStr] = match;
  const month = Number(monthStr);
  if (month < 1 || month > 12) return fallback;

  const fullYear =
    yearStr.length === 4 ? Number(yearStr) : 2000 + Number(yearStr);
  const expiryEnd = new Date(fullYear, month, 0, 23, 59, 59).getTime();
  const isExpired = expiryEnd < now;

  return {
    date: `${monthStr.padStart(2, '0')}/${String(fullYear).slice(-2)}`,
    isExpired,
    isExpiringSoon: !isExpired && expiryEnd - now <= EXPIRING_SOON_WINDOW_MS,
  };
};

/**
 * The SEPA creditor named in the mandate the donor accepts.
 * These are legal identifiers of the organisation that collects in that country, so they live here rather than in translations.
 */
export const getSepaCreditor = (
  country: string | null | undefined
): SepaCreditor =>
  country?.toUpperCase() === 'ES'
    ? PLANET_ESPANA_CREDITOR
    : PLANET_FOUNDATION_CREDITOR;

/** The SetupIntent id is the part of its client secret before "_secret_". */
export const setupIntentIdFromSecret = (clientSecret: string) =>
  clientSecret.split('_secret_')[0];

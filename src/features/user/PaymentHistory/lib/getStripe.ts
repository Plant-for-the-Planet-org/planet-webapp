import type { Stripe, StripeElementLocale } from '@stripe/stripe-js';

import { loadStripe } from '@stripe/stripe-js';

// One entry per publishable key and locale, so it stays small. A failed load is removed so it can be retried.
const stripePromiseCache = new Map<string, Promise<Stripe | null>>();

/** Each country's collect account is its own Stripe account, so Stripe is loaded per publishable key. */
export const getStripe = (
  publishableKey: string,
  locale: string
): Promise<Stripe | null> => {
  const cacheKey = `${publishableKey}-${locale}`;
  const cached = stripePromiseCache.get(cacheKey);
  if (cached) return cached;

  const promise = loadStripe(publishableKey, {
    locale: locale as StripeElementLocale,
  }).catch((error) => {
    stripePromiseCache.delete(cacheKey);
    throw error;
  });

  stripePromiseCache.set(cacheKey, promise);
  return promise;
};

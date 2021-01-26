/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = (key:any,account:any) => {
  if (!stripePromise) {
    stripePromise = loadStripe(key,{stripeAccount:account});
  }
  return stripePromise;
};

export default getStripe;

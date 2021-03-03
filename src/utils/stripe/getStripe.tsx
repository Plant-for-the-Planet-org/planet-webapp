import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

const getStripe = (paymentSetup:any) => {
  let lang = localStorage.getItem('language') || 'en';
  const key = paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey : paymentSetup?.gateways?.stripe?.stripePublishableKey;
  const account = paymentSetup?.gateways?.stripe?.authorization.accountId;
  stripePromise = loadStripe(key,{stripeAccount:account,locale:lang});
  return stripePromise;
};

export default getStripe;

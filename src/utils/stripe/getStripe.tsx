import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

const getStripe = (paymentSetup:any) => {
  const key = paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey : paymentSetup?.gateways?.stripe?.stripePublishableKey;
  const account = paymentSetup?.gateways?.stripe?.authorization.accountId;
  stripePromise = loadStripe(key,{stripeAccount:account});
  return stripePromise;
};

export default getStripe;

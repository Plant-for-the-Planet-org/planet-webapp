import { PayWithCardTypes } from '../../../../common/types/donations';

export async function createDonation(data: any) {
  const res = await fetch(`${process.env.API_ENDPOINT}/app/donations`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${process.env.TENANTID}`,
    },
  });
  const donation = await res.json();
  return donation;
}

export async function payDonation(data: any, id: any) {
  const res = await fetch(`${process.env.API_ENDPOINT}/app/donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'tenant-key': `${process.env.TENANTID}`,
    },
  });
  const contribution = await res.json();
  return contribution;
}

export function getPaymentType(paymentType: String) {
  let paymentTypeUsed;
  switch (paymentType) {
    case 'CARD':
      paymentTypeUsed = 'Credit Card';
      break;
    case 'SEPA':
      paymentTypeUsed = 'SEPA Direct Debit';
      break;
    case 'GOOGLE_PAY':
      paymentTypeUsed = 'Google Pay';
      break;
    case 'APPLE_PAY':
      paymentTypeUsed = 'Apple Pay';
      break;
    case 'BROWSER':
      paymentTypeUsed = 'Browser';
      break;
    default:
      paymentTypeUsed = 'Credit Card';
  }
  return paymentTypeUsed;
}

export function payWithCard({
  setIsPaymentProcessing,
  project,
  currency,
  treeCost,
  treeCount,
  giftDetails,
  isGift,
  setPaymentError,
  paymentSetup,
  setDonationStep,
  paymentMethod,
  window,
  donorDetails,
  taxDeductionCountry
}: PayWithCardTypes) {
  setIsPaymentProcessing(true);


  let createDonationData = {
    type: 'trees',
    project: project.id,
    treeCount: treeCount,
    amount: treeCost * treeCount,
    currency: currency,
    taxDeductionCountry: taxDeductionCountry,
    donor: { ...donorDetails },
  };
  let gift = {
    gift: {
      type: 'invitation',
      recipientName: giftDetails.recipientName,
      recipientEmail: giftDetails.email,
      message: giftDetails.giftMessage,
    },
  };
  if (isGift) {
    createDonationData = {
      ...createDonationData,
      ...gift,
    };
  }
  createDonation(createDonationData)
    .then((res) => {
      // Code for Payment API

      if (res.code === 400) {
        setIsPaymentProcessing(false);
        setPaymentError(res.message);
        return;
      } else if (res.code === 500) {
        setIsPaymentProcessing(false);
        setPaymentError('Something went wrong please try again soon!');
        return;
      } else if (res.code === 503) {
        setIsPaymentProcessing(false);
        setPaymentError(
          'App is undergoing maintenance, please check status.plant-for-the-planet.org for details'
        );
        return;
      } else {
        const payDonationData = {
          paymentProviderRequest: {
            account: paymentSetup.gateways.stripe.account,
            gateway: 'stripe_pi',
            source: {
              id: paymentMethod.id,
              object: 'payment_method',
            },
          },
        };

        payDonation(payDonationData, res.id)
          .then(async (res) => {
            if (res.code === 400) {
              setIsPaymentProcessing(false);
              setPaymentError(res.message);
              return;
            } else if (res.code === 500) {
              setIsPaymentProcessing(false);
              setPaymentError('Something went wrong please try again soon!');
              return;
            } else if (res.code === 503) {
              setIsPaymentProcessing(false);
              setPaymentError(
                'App is undergoing maintenance, please check status.plant-for-the-planet.org for details'
              );
              return;
            }
            if (res.status === 'failed') {
              setIsPaymentProcessing(false);
              setPaymentError(res.message);
              return;
            } else {
              if (res.paymentStatus === 'success') {
                setIsPaymentProcessing(false);
                setDonationStep(4);
              } else if (res.status === 'action_required') {
                const clientSecret = res.response.payment_intent_client_secret;
                const donationID = res.id;
                const stripe = window.Stripe(
                  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
                  {
                    stripeAccount: res.response.account,
                  }
                );
                if (stripe) {
                  await stripe.handleCardAction(clientSecret).then((res) => {
                    if (res.error) {
                      setIsPaymentProcessing(false);
                      setPaymentError(res.error.message);
                    } else {
                      const payDonationData = {
                        paymentProviderRequest: {
                          account: paymentSetup.gateways.stripe.account,
                          gateway: 'stripe_pi',
                          source: {
                            id: res.paymentIntent.id,
                            object: 'payment_intent',
                          },
                        },
                      };
                      payDonation(payDonationData, donationID).then((res) => {
                        if (res.paymentStatus === 'success') {
                          setIsPaymentProcessing(false);
                          setDonationStep(4);
                        } else {
                          setIsPaymentProcessing(false);
                          setPaymentError(res.error.message);
                        }
                      });
                    }
                  });
                }
              }
            }
          })
          .catch((error) => {
            setIsPaymentProcessing(false);
            setPaymentError(error.message);
            return;
          }); // Add Catch if pay donation failes
      }
    })
    .catch((error) => {
      setIsPaymentProcessing(false);
      setPaymentError(error.message);
      return;
    }); // Add Catch if create donation failes
}

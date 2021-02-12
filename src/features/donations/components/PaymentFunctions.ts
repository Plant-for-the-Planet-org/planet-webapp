import getsessionId from '../../../utils/apiRequests/getSessionId';
import { CreateDonationFunctionProps } from '../../common/types/donations';

export async function createDonation(data: any, token: any) {
  let headers = {
    'Content-Type': 'application/json',
    'tenant-key': `${process.env.TENANTID}`,
    'X-SESSION-ID': await getsessionId(),
    'x-locale': `${localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'en'
      }`
  }
  if (token && token !== '') {
    headers = {
      ...headers,
      'Authorization': `OAuth ${token}`
    }
  }
  const res = await fetch(`${process.env.API_ENDPOINT}/app/donations`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: headers,
  });
  const donation = await res.json();
  return donation;
}

export async function payDonation(data: any, id: any, token: any) {
  let headers = {
    'Content-Type': 'application/json',
    'tenant-key': `${process.env.TENANTID}`,
    'X-SESSION-ID': await getsessionId(),
    'x-locale': `${localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'en'
      }`,
  }
  if (token && token !== '') {
    headers = {
      ...headers,
      'Authorization': `OAuth ${token}`
    }
  }
  const res = await fetch(`${process.env.API_ENDPOINT}/app/donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: headers,
  });
  // having to patch this as API returns only a text error message on 401
  if (res.status === 401) {
    return {
      code: res.status,
      message: await res.json(),
    }
  } else {
    const contribution = await res.json();
    return contribution;
  }
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

export async function createDonationFunction({
  isTaxDeductible,
  country,
  project,
  treeCost,
  treeCount,
  currency,
  donorDetails,
  isGift,
  giftDetails,
  setIsPaymentProcessing,
  setPaymentError,
  setDonationID,
  token
}: CreateDonationFunctionProps) {
  const taxDeductionCountry = isTaxDeductible ? country : null;
  const donationData = createDonationData({ project, treeCount, treeCost, currency, donorDetails, taxDeductionCountry, isGift, giftDetails })
  try {
    const donation = await createDonation(donationData, token);
    if (donation) {
      if (donation.code === 400) {
        setIsPaymentProcessing(false);
        setPaymentError(donation.message);
      } else if (donation.code === 500) {
        setIsPaymentProcessing(false);
        setPaymentError('Something went wrong please try again soon!');
      } else if (donation.code === 503) {
        setIsPaymentProcessing(false);
        setPaymentError(
          'App is undergoing maintenance, please check status.plant-for-the-planet.org for details',
        );
      } else {
        // Donation is created. We need donation ID for further operations.
        setDonationID(donation.id)
        return donation;
      }
    }
  }
  catch (error) {
    setIsPaymentProcessing(false);
    setPaymentError(error.message);
  }
}

export function createDonationData({
  project,
  treeCount,
  treeCost,
  currency,
  donorDetails,
  taxDeductionCountry,
  isGift,
  giftDetails
}: any) {
  let donationData = {
    type: 'trees',
    project: project.id,
    treeCount,
    amount: Math.round((treeCost * treeCount + Number.EPSILON) * 100) / 100,
    currency,
    donor: { ...donorDetails },
  };
  if (taxDeductionCountry) {
    donationData = {
      ...donationData,
      taxDeductionCountry,
    };
  }

  if (isGift) {
    if (giftDetails.type === 'invitation') {
      donationData = {
        ...donationData,
        ...{
          gift: {
            type: 'invitation',
            recipientName: giftDetails.recipientName,
            recipientEmail: giftDetails.email,
            message: giftDetails.giftMessage,
          }
        },
      };
    } else if (giftDetails.type === 'direct') {
      donationData = {
        ...donationData,
        ...{
          gift: {
            type: 'direct',
            recipientTreecounter: giftDetails.recipientTreecounter,
            message: giftDetails.giftMessage,
          }
        },
      };
    } else if (giftDetails.type === 'bulk') {
      // for multiple receipients
    }
  }
  return donationData;
}

export async function payDonationFunction({
  gateway,
  paymentMethod,
  setIsPaymentProcessing,
  setPaymentError,
  t,
  paymentSetup,
  donationID,
  token,
  setDonationStep,
  donorDetails
}: any) {
  setIsPaymentProcessing(true);

  if (!paymentMethod) {
    setIsPaymentProcessing(false);
    setPaymentError(t('donate:noPaymentMethodError'));
    return;
  }
  let payDonationData;
  if (gateway === 'stripe') {
    payDonationData = {
      paymentProviderRequest: {
        account: paymentSetup.gateways.stripe.account,
        gateway: 'stripe_pi',
        source: {
          id: paymentMethod.id,
          object: 'payment_method',
        },
      },
    };
  }
  else if (gateway === 'paypal') {
    payDonationData = {
      paymentProviderRequest: {
        account: paymentSetup.gateways.paypal.account,
        gateway: 'paypal',
        source: {
          ...paymentMethod
        },
      },
    };
  }
  else if (gateway === 'stripe_giropay') {
    payDonationData = {
      paymentProviderRequest: {
        account: paymentSetup.gateways.stripe.account,
        gateway: 'stripe_pi',
        source: {
          object: 'giropay'
        }
      }
    }
  }
  else if (gateway === 'stripe_sofort') {
    payDonationData = {
      paymentProviderRequest: {
        account: paymentSetup.gateways.stripe.account,
        gateway: 'stripe_pi',
        source: {
          object: 'sofort'
        }
      }
    }
  }

  try {
    const paidDonation = await payDonation(payDonationData, donationID, token);

    if (paidDonation) {
      if (paidDonation.code === 400 || paidDonation.code === 401) {
        setIsPaymentProcessing(false);
        setPaymentError(paidDonation.message);
        return;
      } if (paidDonation.code === 500) {
        setIsPaymentProcessing(false);
        setPaymentError('Something went wrong please try again soon!');
        return;
      } if (paidDonation.code === 503) {
        setIsPaymentProcessing(false);
        setPaymentError(
          'App is undergoing maintenance, please check status.plant-for-the-planet.org for details',
        );
        return;
      }
      if (paidDonation.status === 'failed') {
        setIsPaymentProcessing(false);
        setPaymentError(paidDonation.message);
      } else if (paidDonation.paymentStatus === 'success' || paidDonation.paymentStatus === 'pending') {
        setIsPaymentProcessing(false);
        setDonationStep(4);
        
        return paidDonation;
      } else if (paidDonation.status === 'action_required') {
        handleSCAPaymentFunction({
          gateway,
          paidDonation,
          paymentSetup,
          window,
          setIsPaymentProcessing,
          setPaymentError,
          donationID,
          token,
          setDonationStep,
          donorDetails
        })
      }
    }
  } catch (error) {
    setIsPaymentProcessing(false);
    setPaymentError(error.message);
  }
}

export async function handleSCAPaymentFunction({
  gateway,
  paidDonation,
  paymentSetup,
  window,
  setIsPaymentProcessing,
  setPaymentError,
  donationID,
  token,
  setDonationStep,
  donorDetails
}: any) {  
  const clientSecret = paidDonation.response.payment_intent_client_secret;
  const key = paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey ? paymentSetup?.gateways?.stripe?.authorization.stripePublishableKey : paymentSetup?.gateways?.stripe?.stripePublishableKey;
  const stripe = window.Stripe(
    key,
    {
      stripeAccount: paidDonation.response.account,
    },
  );
  if (stripe) {
    if(gateway === 'stripe'){
      const SCAdonation = await stripe.handleCardAction(clientSecret);      
      if (SCAdonation) {
        if (SCAdonation.error) {
          setIsPaymentProcessing(false);
          setPaymentError(paidDonation.error.message);
        } else {
          const payDonationData = {
            paymentProviderRequest: {
              account: paymentSetup.gateways.stripe.account,
              gateway: 'stripe_pi',
              source: {
                id: SCAdonation.paymentIntent.id,
                object: 'payment_intent',
              },
            },
          };
          const SCAPaidDonation = await payDonation(payDonationData, donationID, token);
          if (SCAPaidDonation) {
            if (SCAPaidDonation.paymentStatus) {
              setIsPaymentProcessing(false);
              setDonationStep(4);
              return SCAPaidDonation;
            } else {
              setIsPaymentProcessing(false);
              setPaymentError(SCAPaidDonation.error ? SCAPaidDonation.error.message : SCAPaidDonation.message);
            }
          }
        }
      }
    }
    else if(gateway === 'stripe_giropay'){
      const {error, paymentIntent} = await stripe.confirmGiropayPayment(
        paidDonation.response.payment_intent_client_secret,
        {
          payment_method: {
            billing_details: {
              name: `${donorDetails.firstname} ${donorDetails.lastname}`,
              email:donorDetails.email,
              address:{
                city: donorDetails.city,
                country: donorDetails.country,
                line1: donorDetails.address,
                postal_code: donorDetails.zipCode,
              }
            }
          },
          return_url: `${process.env.NEXTAUTH_URL}/payment-status?donationID=${donationID}&paymentType=Giropay`,
        }
      );

      if (error) {
        setIsPaymentProcessing(false);
        setPaymentError(error);
      }
      else {
        console.log('paymentIntent',paymentIntent)
      }
    }

    else if(gateway === 'stripe_sofort'){
      const {error, paymentIntent} = await stripe.confirmSofortPayment(
        paidDonation.response.payment_intent_client_secret,
        {
          payment_method: {
            sofort: {
              country: donorDetails.country
            },
            billing_details: {
              name: `${donorDetails.firstname} ${donorDetails.lastname}`,
              email:donorDetails.email,
              address:{
                city: donorDetails.city,
                country: donorDetails.country,
                line1: donorDetails.address,
                postal_code: donorDetails.zipCode,
              }
            }
          },
          return_url: `${process.env.NEXTAUTH_URL}/payment-status?donationID=${donationID}&paymentType=Sofort`,
        }
      );

      if (error) {
        setIsPaymentProcessing(false);
        setPaymentError(error);
      }
      else {
        console.log('paymentIntent',paymentIntent)
      }
    }
    
  }
}
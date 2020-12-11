import React, { ReactElement } from 'react'
import CardPayments from './components/CardPayments'
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../../utils/stripe/getStripe';
import styles from './styles/PaymentDetails.module.scss';
import ButtonLoader from '../common/ContentLoaders/ButtonLoader';
import { PaymentRequestCustomButton } from './components/PaymentRequestForm';
import { formatAmountForStripe } from '../../utils/stripe/stripeHelpers';
import { getRequest } from '../../utils/apiRequests/api';
import i18next from '../../../i18n/';
import getFormatedCurrency from '../../utils/countryCurrency/getFormattedCurrency';
import { getFormattedNumber } from '../../utils/getFormattedNumber';
import { payDonation } from '../donations/components/treeDonation/PaymentFunctions';
import PaymentProgress from '../common/ContentLoaders/Donations/PaymentProgress';
import ThankYou from '../donations/screens/ThankYou';
import { useRouter } from 'next/router';
import Paypal from './components/Paypal';
import { paypalCurrencies } from '../../utils/paypalCurrencies';
const { useTranslation } = i18next;

interface Props {
  paymentData: any
}

function LegacyDonations({ paymentData }: Props): ReactElement {

  const [paymentType, setPaymentType] = React.useState('CARD')
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);

  const [paymentSetup, setPaymentSetup] = React.useState();

  const [currency, setCurrency] = React.useState(paymentData.currency);
  const [treeCost, setTreeCost] = React.useState();
  const [treeCount, setTreeCount] = React.useState(paymentData.treeCount);

  const [isDonationComplete, setIsDonationComplete] = React.useState(false)

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState('');

  const [country, setCountry] = React.useState(
    localStorage.getItem('countryCode')!
  );

  // stores the value as boolean whether payment options is being fetched or not
  // used for showing a loader
  const [isPaymentOptionsLoading, setIsPaymentOptionsLoading] = React.useState<
    boolean
  >(false);

  //  to load payment data
  React.useEffect(() => {
    async function loadPaymentSetup() {
      try {
        setIsPaymentOptionsLoading(true);

        const paymentSetupData = await getRequest(`/app/projects/${paymentData.plantProjectGuid}/paymentOptions?country=${country}`);
        if (paymentSetupData) {
          setPaymentSetup(paymentSetupData);
          setTreeCost(paymentSetupData.treeCost);
          setCurrency(paymentSetupData.currency);
        }
        setIsPaymentOptionsLoading(false);
      } catch (err) {
        // console.log(err);
      }
    }
    loadPaymentSetup();
  }, [paymentData, country]);

  const onPaymentFunction = (gateway:any,paymentMethod: any) => {
    setIsPaymentProcessing(true);

    let payDonationData;
    if(gateway==='stripe'){
      payDonationData = {
        paymentProviderRequest: {
          account: paymentSetup.gateways.stripe.account,
          gateway: 'stripe',
          source: {
            id: paymentMethod.id,
            object: 'payment_method',
          },
        },
      };
    }
    else if(gateway === 'paypal'){
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

    payDonation(payDonationData, paymentData.guid, null)
      .then(async (res) => {
        if (res.code === 400) {
          setIsPaymentProcessing(false);
          setPaymentError(res.message);
          return;
        } if (res.code === 500) {
          setIsPaymentProcessing(false);
          setPaymentError('Something went wrong please try again soon!');
          return;
        } if (res.code === 503) {
          setIsPaymentProcessing(false);
          setPaymentError(
            'App is undergoing maintenance, please check status.plant-for-the-planet.org for details',
          );
          return;
        }
        if (res.status === 'failed') {
          setIsPaymentProcessing(false);
          setPaymentError(res.message);
        } else if (res.paymentStatus === 'success') {
          setIsPaymentProcessing(false);
          setIsDonationComplete(true);
        } else if (res.status === 'action_required') {
          const clientSecret = res.response.payment_intent_client_secret;
          const donationID = res.id;
          const stripe = window.Stripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            {
              stripeAccount: res.response.account,
            },
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
                    gateway: 'stripe',
                    source: {
                      id: res.paymentIntent.id,
                      object: 'payment_intent',
                    },
                  },
                };
                payDonation(payDonationData, donationID, null).then((res) => {
                  if (res.paymentStatus === 'success') {
                    setIsPaymentProcessing(false);
                    setIsDonationComplete(true);
                  } else {
                    setIsPaymentProcessing(false);
                    setPaymentError(res.error ? res.error.message : res.message);
                  }
                });
              }
            });
          }
        }
      })
      .catch((error) => {
        setIsPaymentProcessing(false);
        setPaymentError(error.message);
      });
  }

  const router = useRouter();
  const onClose = () => {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }
  let isGift = false;
  let giftDetails = {
    recipientName: null
  };
  if (paymentData.giftRecipient || paymentData.supportedTreecounterName) {
    isGift = true;
    if (paymentData.giftRecipient) {
      giftDetails.recipientName = paymentData.giftRecipient;
    }
    if (paymentData.supportedTreecounterName) {
      giftDetails.recipientName = paymentData.supportedTreecounterName;
    }
  }
  

const paypalSuccess =(data:any)=>{
  if(data.error){
    setPaymentError(data.error.message)
  }else{
    onPaymentFunction('paypal',data);
  }
} 

  const project = {
    name: paymentData.plantProjectName,
    country: paymentData.plantProjectCountry
  }
  const ThankYouProps = {
    project,
    treeCount,
    treeCost,
    currency,
    contactDetails: {},
    isGift,
    giftDetails,
    onClose,
    paymentType,
    setDonationStep: null
  };  
  
  return ready ? (
    !isDonationComplete ? isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
      <div className={styles.container}>
        {paymentError && (
          <div className={styles.paymentError}>{paymentError}</div>
        )}
        <div className={styles.header}>
          <div className={styles.headerTitle}>{t('donate:paymentDetails')}</div>
          <div className={styles.headerText}>
            {t('common:to_project_by_tpo', {
              projectName: paymentData.plantProjectName,
              tpoName: paymentData.tpoName,
            })}
          </div>
          {paymentData.giftRecipient || paymentData.supportedTreecounterName ? (
            paymentData.giftRecipient ?
              (<div className={styles.headerText}>
                {t('donate:giftTo')} {paymentData.giftRecipient}
              </div>) :
              (<div className={styles.headerText}>
                {t('donate:supporting')} {paymentData.supportedTreecounterName}
              </div>)
          ) : null}

        </div>

        <div className={styles.finalTreeCount}>
          <div className={styles.totalCost}>
            {!isPaymentOptionsLoading ? getFormatedCurrency(i18n.language, currency, treeCount * treeCost) : null}
          </div>
          <div className={styles.totalCostText}>
            {t('donate:fortreeCountTrees', {
              treeCount: getFormattedNumber(i18n.language, Number(treeCount)),
            })}
          </div>
        </div>

        <Elements stripe={getStripe()}>
          <CardPayments onPaymentFunction={(data)=> onPaymentFunction('stripe',data)} paymentType={paymentType} setPaymentType={setPaymentType} />
        </Elements>


        <Elements stripe={getStripe()}>
          {!isPaymentOptionsLoading
            && paymentSetup?.gateways?.stripe?.account
            && currency ? (
              <>
                <div className={styles.horizontalLine} />
                <PaymentRequestCustomButton
                  country={country}
                  currency={currency}
                  amount={formatAmountForStripe(
                    treeCost * treeCount,
                    currency.toLowerCase(),
                  )}
                  onPaymentFunction={(data)=> onPaymentFunction('stripe',data)}
                />
              </>
            ) : (
              <div className={styles.actionButtonsContainer}>
                <ButtonLoader />
              </div>
            )}
        </Elements>

        { paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal &&
        <Paypal
          onSuccess={data => {
            paypalSuccess(data);
          }}
          amount={treeCost * treeCount}
          currency={currency}
          donationId={paymentData.guid}
          mode={paymentSetup?.gateways.paypal.isLive ? 'production' : 'sandbox'}
          clientID={paymentSetup?.gateways.paypal.authorization.client_id}
        /> }
      </div>
    ) : (
      <ThankYou {...ThankYouProps} />
    )
  ) : null;
}

export default LegacyDonations

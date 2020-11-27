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
import Sugar from 'sugar';
import { payDonation } from '../donations/components/treeDonation/PaymentFunctions';
import PaymentProgress from '../common/ContentLoaders/Donations/PaymentProgress';

const { useTranslation } = i18next;

interface Props {
    paymentData: any
}

function LegacyDonations({ paymentData }: Props): ReactElement {

    const [paymentType, setPaymentType] = React.useState('CARD')
    const { t, i18n } = useTranslation(['donate', 'common', 'country']);

    const [paymentSetup, setPaymentSetup] = React.useState();

    const [currency, setCurrency] = React.useState(paymentData.currency);
    const [treeCost, setTreeCost] = React.useState(paymentData.treeCost);

    const [totalAmount, setTotalAmount] = React.useState(paymentData.amount)
    const treeCount = paymentData.treeCount;

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

    const onPaymentFunction = (paymentMethod:any) => {
        console.log('Google/apple pay');
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
                          gateway: 'stripe_pi',
                          source: {
                            id: res.paymentIntent.id,
                            object: 'payment_intent',
                          },
                        },
                      };
                      payDonation(payDonationData, donationID, null).then((res) => {
                        if (res.paymentStatus === 'success') {
                          setIsPaymentProcessing(false);
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
    return isPaymentProcessing ? (
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
                       Gift to {paymentData.giftRecipient}
                    </div>) : 
                    (<div className={styles.headerText}>
                        Supporting {paymentData.supportedTreecounterName}
                    </div>)
                ) : null}

            </div>

            <div className={styles.finalTreeCount}>
                <div className={styles.totalCost}>
                    {getFormatedCurrency(i18n.language, currency, totalAmount)}
                    {/* {(treeCount * treeCost).toFixed(2)}{' '} */}
                </div>
                <div className={styles.totalCostText}>
                    {t('donate:fortreeCountTrees', {
                        treeCount: Sugar.Number.format(Number(treeCount)),
                    })}
                </div>
            </div>

            <Elements stripe={getStripe()}>
                <CardPayments onPaymentFunction={onPaymentFunction} paymentType={paymentType} setPaymentType={setPaymentType} />
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
                            onPaymentFunction={onPaymentFunction}
                        />
                        </>
                    ) : (
                        <div className={styles.actionButtonsContainer}>
                            <ButtonLoader />
                        </div>
                    )}
            </Elements>
        </div>
    )
}

export default LegacyDonations

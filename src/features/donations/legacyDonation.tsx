import React, { ReactElement } from 'react'
import CardPayments from './components/paymentMethods/CardPayments'
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '../../utils/stripe/getStripe';
import styles from './styles/Donations.module.scss';
import ButtonLoader from '../common/ContentLoaders/ButtonLoader';
import { NativePay } from './components/paymentMethods/PaymentRequestCustomButton';
import { formatAmountForStripe } from '../../utils/stripe/stripeHelpers';
import { getRequest } from '../../utils/apiRequests/api';
import i18next from '../../../i18n';
import getFormatedCurrency from '../../utils/countryCurrency/getFormattedCurrency';
import { getFormattedNumber } from '../../utils/getFormattedNumber';
import { payDonationFunction } from './components/PaymentFunctions';
import PaymentProgress from '../common/ContentLoaders/Donations/PaymentProgress';
import ThankYou from './screens/ThankYou';
import { useRouter } from 'next/router';
import Paypal from './components/paymentMethods/Paypal';
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
    typeof window !== 'undefined' ? localStorage.getItem('countryCode') : 'DE'
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

  const onSubmitPayment = (gateway: any, paymentMethod: any) => {
    payDonationFunction({
      gateway,
      paymentMethod,
      setIsPaymentProcessing,
      setPaymentError,
      t,
      paymentSetup,
      donationID: paymentData.guid,
      token: null,
      setDonationStep: () => { }
    }).then((res) => {
      if (res) {
        if (res.paymentStatus || res.status) {
          setIsPaymentProcessing(false);
          setIsDonationComplete(true);
        } else {
          setIsPaymentProcessing(false);
          setPaymentError(res.error ? res.error.message : res.message);
        }
      } else {
        setIsPaymentProcessing(false);
      }
    })
  }
  const router = useRouter();
  const onClose = () => {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
  }
  let isGift = false;
  const giftDetails = {
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

  const project = {
    name: paymentData.plantProjectName,
    country: paymentData.plantProjectCountry
  }
  const ThankYouProps = {
    donationID: paymentData.guid,
    onClose,
    paymentType,
  };

  return ready ? (
    !isDonationComplete ? isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
        <div className={styles.container}>
          {paymentError && (
            <div className={styles.paymentError}>{paymentError}</div>
          )}
          <div className={styles.header} style={{textAlign:'center'}}>
            <div className={styles.headerTitle}>{t('donate:paymentDetails')}</div>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
              <div className={styles.totalCost} style={{color:styles.light}}>
              {!isPaymentOptionsLoading ? getFormatedCurrency(i18n.language, currency, treeCount * treeCost) : null}

              </div>
              <div className={styles.totalCostText} style={{color:styles.light}}>
              {t('donate:fortreeCountTrees', {
                count: Number(treeCount),
                treeCount: getFormattedNumber(i18n.language, Number(treeCount)),
              })}
              </div>
            </div>
            <div className={styles.plantProjectName}>
            {t('common:to_project_by_tpo', {
              projectName: paymentData.plantProjectName,
              tpoName: paymentData.tpoName,
            })}
            </div>
            {paymentData.giftRecipient || paymentData.supportedTreecounterName ? (
            paymentData.giftRecipient ?
              (<div className={styles.plantProjectName}>
                {t('donate:giftTo')} {paymentData.giftRecipient}
              </div>) :
              (<div className={styles.plantProjectName}>
                {t('donate:supporting')} {paymentData.supportedTreecounterName}
              </div>)
          ) : null}
          </div>



          {paymentSetup && (
            <>
              <Elements stripe={getStripe(paymentSetup)}>
                <CardPayments onPaymentFunction={(data) => onSubmitPayment('stripe', data)} paymentType={paymentType} setPaymentType={setPaymentType} />
              </Elements>


              <Elements stripe={getStripe(paymentSetup)}>
                {!isPaymentOptionsLoading
                  && paymentSetup?.gateways?.stripe?.account
                  && currency ? (
                    <>
                      <div className={styles.horizontalLine} />
                      <NativePay
                        country={country}
                        currency={currency}
                        continueNext={null}
                        amount={formatAmountForStripe(
                          treeCost * treeCount,
                          currency.toLowerCase(),
                        )}
                        onPaymentFunction={(data) => onSubmitPayment('stripe', data)}
                        paymentSetup={paymentSetup}
                      />
                    </>
                  ) : (
                    <div className={styles.actionButtonsContainerCenter}>
                      <ButtonLoader />
                    </div>
                  )}
              </Elements>
            </>
          )}

          { paypalCurrencies.includes(currency) && paymentSetup?.gateways.paypal &&
            <Paypal
              onSuccess={data => {
                onSubmitPayment('paypal', data)
              }}
              amount={treeCost * treeCount}
              currency={currency}
              donationId={paymentData.guid}
              mode={paymentSetup?.gateways.paypal.isLive ? 'production' : 'sandbox'}
              clientID={paymentSetup?.gateways.paypal.authorization.client_id}
            />}
        </div>
      ) : (
        <ThankYou {...ThankYouProps} />
      )
  ) : <></>;
}

export default LegacyDonations

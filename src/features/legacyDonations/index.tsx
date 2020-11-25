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

                const paymentSetupData = await getRequest(`/app/projects/proj_evbM6c4YBGX2hNS1Bc2ORWPq/paymentOptions?country=${country}`);
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

    const onPaymentFunction = () => {
        console.log('Google/apple pay');
    }
    return (
        <div className={styles.container}>
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
                <CardPayments paymentType={paymentType} setPaymentType={setPaymentType} />
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

import { FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import CreditCard from '../../../../../public/assets/images/icons/donation/CreditCard';
import { getCardBrand } from '../../../../utils/stripe/stripeHelpers';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import styles from './../../styles/Donations.module.scss';
// import { payWithCard } from '../components/treeDonation/PaymentFunctions';
import i18next from '../../../../../i18n';
import theme from '../../../../theme/theme';
import themeProperties from '../../../../theme/themeProperties';
import { ThemeContext } from "../../../../theme/themeContext";

const { useTranslation } = i18next;

const FormControlNew = withStyles({
  root: {
    width: '100%',
    backgroundColor: 'var(--blueish-grey)',
    border: '0px!important',
    borderRadius: '10px',
    fontFamily: styles.primaryFontFamily,
    padding: '18.5px',
  },
})(FormControl);

const getInputOptions = (placeholder: string, theme:string) => {
  const ObjectM = {
    style: {
      base: {
        color: theme === "theme-light"
        ? themeProperties.light.primaryFontColor
        : themeProperties.dark.primaryFontColor,
        fontFamily: styles.primaryFontFamily,
        fontSize: '16px',
        '::placeholder': {
          color: theme === "theme-light"
          ? themeProperties.light.primaryFontColor
          : themeProperties.dark.primaryFontColor,
          fontFamily: styles.primaryFontFamily,
          fontSize: '14px',
        },
      },
      invalid: {
        color: styles.dangerColor,
        iconColor: styles.dangerColor,
      },
    },
    placeholder: placeholder,
  };
  return ObjectM;
};

function CardPayments({
  totalCost,
  paymentType,
  setPaymentType,
  onPaymentFunction,
  donorDetails
}: any): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common']);
  const stripe = useStripe();
  const elements = useElements();
  const [cardNumber, setCardNumber] = React.useState(false);
  const [cardCvv, setCardCvv] = React.useState(false);
  const [cardDate, setCardDate] = React.useState(false);


  React.useEffect(() => {
    setPaymentType('CARD');
  }, []);

  const [paymentError, setPaymentError] = React.useState('');
  const [showContinue, setShowContinue] = React.useState(false);
  const [showBrand, setShowBrand] = React.useState('');
  React.useEffect(() => {
    if (elements) {
      const cardNumberElement = elements!.getElement(CardNumberElement);
      cardNumberElement && cardNumberElement!.on('change', ({ error, complete, brand }) => {
        if (error) {
          setShowContinue(false);
        } else if (complete) {
          setShowBrand(brand);
          const cardExpiryElement = elements!.getElement(CardExpiryElement);
          cardExpiryElement!.on('change', ({ error, complete }) => {
            if (error) {
              setShowContinue(false);
            } else if (complete) {
              const cardCvcElement = elements!.getElement(CardCvcElement);
              cardCvcElement!.on('change', ({ error, complete }) => {
                if (error) {
                  setShowContinue(false);
                } else if (complete) {
                  setShowContinue(true);
                }
              });
            }
          });
        }
      });
    }

  }, [CardNumberElement, CardExpiryElement, CardCvcElement]);

  const createPaymentMethodCC = (cardElement: any) => {
    if(donorDetails){
      return stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
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
      })
    }
    else {
      return stripe.createPaymentMethod('card', cardElement)
    }
  }
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    setShowContinue(false);
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    let paymentMethod: any;

    if (paymentType === 'CARD') {
      const cardElement = elements!.getElement(CardNumberElement);
      setCardCvv(false);
      setCardDate(false);
      setCardNumber(false);
      cardElement!.on('change', ({ error }) => {
        if (error) {
          // setPaymentError(error.message);
          setPaymentError(t('donate:noPaymentMethodError'));
          return;
        }
      });
      const payload = await createPaymentMethodCC(cardElement);
      paymentMethod = payload.paymentMethod;
      // Add payload error if failed
    }
    if (paymentMethod) {
      onPaymentFunction(paymentMethod);
    } else {
      setPaymentError(t('donate:noPaymentMethodError'));
      return;
    }
  };

  const handleChange = (change) => {
    if (change.complete === true) {
      setCardNumber(true);
    } else {
      setCardNumber(false);
    }
  };
  const handleChangeCvv = (change) => {
    if (change.complete === true) {
      setCardCvv(true);
    } else {
      setCardCvv(false);
    }
  };
  const handleChangeCardDate = (change) => {
    if (change.complete === true) {
      setCardDate(true);
    } else {
      setCardDate(false);
    }
  };

  const validateCard = () => {
    if (cardNumber && cardCvv && cardDate) {
      setShowContinue(true);
    } else {
      setShowContinue(false);
    }
  };

  React.useEffect(() => {
    validateCard();
  }, [cardDate, cardNumber, cardCvv]);
  const {theme} = React.useContext(ThemeContext)
  return ready ? (
      <div>

        {paymentError && (
          <div className={styles.paymentError}>{paymentError}</div>
        )}

        {
          <div className={styles.paymentModeContainer}>

            <div className={styles.formRow}>
              <FormControlNew variant="outlined">
                <CardNumberElement
                  id="cardNumber"
                  options={getInputOptions(t('donate:cardNumber'), theme)}
                  onChange={handleChange}
                />
              </FormControlNew>
            </div>
            <div className={styles.formRow}>
              <FormControlNew variant="outlined">
                <CardExpiryElement
                  id="expiry"
                  options={getInputOptions(t('donate:expDate'), theme)}
                  onChange={handleChangeCardDate}
                />
              </FormControlNew>
              <div style={{ width: '20px' }}></div>
              <FormControlNew variant="outlined">
                <CardCvcElement id="cvc" options={getInputOptions('CVV', theme)} onChange={handleChangeCvv} />
              </FormControlNew>
            </div>
          </div>
        }


        {/* <div className={styles.finalTreeCount}>
        <div className={styles.totalCost}>
          {getFormatedCurrency(i18n.language, currency, treeCount * treeCost)}
        </div>
        <div className={styles.totalCostText}>
          {t('donate:fortreeCountTrees', {
            count: Number(treeCount),
            treeCount: getFormattedNumber(i18n.language, Number(treeCount)),
          })}
        </div>
      </div> */}
        {showContinue ? (
          <div onClick={handleSubmit} className={styles.actionButtonsContainerCenter}>
            <AnimatedButton className={styles.continueButton} id='donateContinueButton'>
              {t('common:donate')}
              <div className={styles.totalCost}
              style={{ color: styles.light, fontSize: "14px" }}>
                 {totalCost}
                  </div>
            </AnimatedButton>
          </div>
        ) : (
            <div className={styles.actionButtonsContainerCenter}>
              <AnimatedButton disabled className={styles.continueButtonDisabled} id='donateContinueButton'>
                {t('common:donate')}
                <div className={styles.totalCost}
              style={{ color: styles.light, fontSize: "14px" }}>
              {totalCost}
                  </div>
              </AnimatedButton>
            </div>
          )}

      </div>
  ) : <></>;
}

export default CardPayments;

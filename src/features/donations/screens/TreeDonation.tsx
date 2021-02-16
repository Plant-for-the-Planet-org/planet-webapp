import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';
import DownArrow from '../../../../public/assets/images/icons/DownArrow';
import Close from '../../../../public/assets/images/icons/headerIcons/close';
import { formatAmountForStripe } from '../../../utils/stripe/stripeHelpers';
import ButtonLoader from '../../common/ContentLoaders/ButtonLoader';
import PaymentProgress from '../../common/ContentLoaders/Donations/PaymentProgress';
import ToggleSwitch from '../../common/InputTypes/ToggleSwitch';
import { TreeDonationProps } from '../../common/types/donations';
import SelectCurrencyModal from '../components/treeDonation/SelectCurrencyModal';
import SelectTaxDeductionCountryModal from '../components/treeDonation/SelectTaxDeductionCountryModal';
import styles from '../styles/TreeDonation.module.scss';
import { NativePay } from '../components/paymentMethods/PaymentRequestCustomButton';
import GiftForm from '../components/treeDonation/GiftForm';
import DirectGiftForm from '../components/treeDonation/DirectGiftForm';
import { createDonationFunction, payDonationFunction } from '../components/PaymentFunctions';
import i18next from '../../../../i18n';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { useAuth0 } from '@auth0/auth0-react';
import { getMinimumAmountForCurrency } from '../../../utils/countryCurrency/getExchange';
import ShowTreeCount from '../components/ShowTreeCount';
import tenantConfig from '../../../../tenant.config';

const { useTranslation } = i18next;

function TreeDonation({
  project,
  onClose,
  treeCount,
  setTreeCount,
  isGift,
  setIsGift,
  treeCost,
  paymentSetup,
  isTaxDeductible,
  setIsTaxDeductible,
  currency,
  setCurrency,
  country,
  setCountry,
  setDonationStep,
  giftDetails,
  setGiftDetails,
  directGift,
  setDirectGift,
  setPaymentType,
  isPaymentOptionsLoading,
  token,
  recurrencyMnemonic,
  setRecurrencyMnemonic,
  setDonationID,
  donationID
}: TreeDonationProps): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);
  const treeCountOptions = [10, 20, 50, 150];

  const config = tenantConfig();

  const {
    loginWithRedirect,
  } = useAuth0();

  const [openCurrencyModal, setOpenCurrencyModal] = React.useState(false);
  const [openTaxDeductionModal, setOpenTaxDeductionModal] = React.useState(
    false
  );
  const [paymentError, setPaymentError] = React.useState('');

  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const [customTreeInputValue, setCustomTreeInputValue] = React.useState("");
  const [screenWidth, setScreenWidth] = React.useState('');
  const [minAmt, setMinAmt] = React.useState(0);

  const setCustomTreeValue = (e: any) => {
    if (e.target.value === '' || e.target.value < 1) {
      // if input is '', default 1
      setTreeCount(1);
    } else if (e.target.value.toString().length <= 12) {
      setTreeCount(e.target.value);
    }
  };

  const continueNext = () => {
    if (isGift) {
      if (isGiftValidated) {
        setDonationStep(2);
      } else {
        setPaymentError(t('donate:giftValidation'))
      }
    } else {
      setDonationStep(2);
    }

  };

  React.useEffect(() => {
    if (project.taxDeductionCountries.includes(country)) {
      setIsTaxDeductible(true);
    } else {
      setIsTaxDeductible(false);
    }
    if (window.screen.width <= 412) {
      setScreenWidth(100);
    }

    setMinAmt(getMinimumAmountForCurrency(currency));
  }, [country]);

  const onPaymentFunction = async(paymentMethod: any, paymentRequest: any) => {
    // eslint-disable-next-line no-underscore-dangle
    setPaymentType(paymentRequest._activeBackingLibraryName);

    let fullName = paymentMethod.billing_details.name;
    fullName = String(fullName).split(' ');
    const firstName = fullName[0];
    fullName.shift();
    const lastName = String(fullName).replace(/,/g, ' ');

    const donorDetails = {
      firstname: firstName,
      lastname: lastName,
      email: paymentMethod.billing_details.email,
      address: paymentMethod.billing_details.address.line1,
      zipCode: paymentMethod.billing_details.address.postal_code,
      city: paymentMethod.billing_details.address.city,
      country: paymentMethod.billing_details.address.country,
    };

    await createDonationFunction({
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
      recurrencyMnemonic,
      setDonationID,
      token
    }).then((res)=>{      
      payDonationFunction ({
        gateway:'stripe',
        paymentMethod,
        setIsPaymentProcessing,
        setPaymentError,
        t,
        paymentSetup,
        donationID:res.id,
        token,
        setDonationStep
      })
    });
  };

  const [isCustomTrees, setIsCustomTrees] = React.useState(false);
  const [isGiftValidated, setGiftValidated] = React.useState(false);

  const loginuser = () => {
    loginWithRedirect({ redirectUri: `${process.env.NEXTAUTH_URL}/login`, ui_locales: localStorage.getItem('language') || 'en' });
  }

  return ready ? (
    isPaymentProcessing ? (
      <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    ) : (
        <div className={styles.mainContainer}
          style={{
            marginTop: token ? '360px' : '200px'
          }}
        >
          <div
            className={`${styles.cardContainer}`}
            style={{
              marginTop: isGift ? '274px' : '0px',
              width: `${screenWidth}%`,
            }}
          >
            <div className={styles.header}>
              <button id={'treeDonationClose'}
                onClick={onClose}
                onKeyPress={onClose}
                role="button"
                tabIndex={0}
                className={styles.headerCloseIcon}
              >
                <Close color={styles.primaryFontColor} />
              </button>
              <div className={styles.headerTitle}>{t('donate:treeDonation')}</div>
            </div>

            <div className={styles.plantProjectName}>
              {t('common:to_project_by_tpo', {
                projectName: project.name,
                tpoName: project.tpo.name,
              })}
            </div>

            <div
              className={styles.currencyRate}
              onClick={() => setOpenCurrencyModal(true)}
              onKeyPress={() => setOpenCurrencyModal(true)}
              role="button"
              tabIndex={0}
            >
              <div className={styles.currency}>{currency}</div>
              <div className={styles.downArrow}>
                <DownArrow color="#87B738" />
              </div>
              <div className={styles.rate}>
                {getFormatedCurrency(i18n.language, '', Number(treeCost))}{' '}
                {t('donate:perTree')}
              </div>
            </div>

            <div className={styles.isGiftDonation}>
              <div className={styles.isGiftDonationText}>
                {t('donate:myDonationGiftToSomeone')}
              </div>
              <ToggleSwitch
                checked={isGift}
                onChange={() => setIsGift(!isGift)}
                name="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>

            {isGift ? (
              directGift ? (
                <DirectGiftForm
                  isGift={isGift}
                  giftDetails={giftDetails}
                  setGiftDetails={setGiftDetails}
                  directGift={directGift}
                  setDirectGift={setDirectGift}
                  setGiftValidated={setGiftValidated}
                />
              ) : (
                  <GiftForm
                    isGift={isGift}
                    giftDetails={giftDetails}
                    setGiftDetails={setGiftDetails}
                    setGiftValidated={setGiftValidated}
                  />
                )
            ) : null}

            <div className={styles.selectTreeCount}>
              {treeCountOptions.map((option) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // eslint-disable-next-line no-unused-expressions
                    setTreeCount(option);
                    setIsCustomTrees(false);
                    setCustomTreeInputValue("");
                  }}
                  key={option}
                  className={
                    treeCount === option && !isCustomTrees
                      ? styles.treeCountOptionSelected
                      : styles.treeCountOption
                  }
                >
                  <div className={styles.treeCountOptionTrees}>{option}</div>
                  <div className={styles.treeCountOptionTrees}>
                    {t('common:trees')}
                  </div>
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={
                  isCustomTrees
                    ? styles.treeCountOptionSelected
                    : styles.treeCountOption
                }
                style={{ width: '65%', flexDirection: 'row' }}
                onClick={() => setIsCustomTrees(true)}
              >
                <input
                  className={styles.customTreeInput}
                  onInput={(e) => {
                    // replaces any character other than number to blank
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');

                    //  if length of input more than 12, display only 12 digits
                    if (e.target.value.toString().length >= 12) {
                      e.target.value = e.target.value.toString().slice(0, 12);
                    }
                  }}
                  value={customTreeInputValue}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  onChange={(e) => {
                    setCustomTreeValue(e);
                    setCustomTreeInputValue(e.target.value)
                  }
                  }
                />
                <div className={styles.treeCountOptionTrees}>
                  {t('common:trees')}
                </div>
              </motion.button>
            </div>

            {config.allowRecurrecny && paymentSetup?.gateways?.stripe?.recurrency?.enabled ? token ? (
              <>
                <div className={styles.donationFrequencyTitle}>
                  {t('donate:recurrency')}
                </div>
                <div className={styles.selectDonationFrequency}>
                  {paymentSetup?.gateways?.stripe?.recurrency?.intervals.map((option) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setRecurrencyMnemonic(option);
                      }}
                      key={option}
                      className={
                        recurrencyMnemonic === option
                          ? styles.donationFrequencyOptionSelected
                          : styles.donationFrequencyOption
                      }
                    >
                      <div className={styles.donationFrequencyOptionTrees}>
                        {t(`donate:${option}`)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
                <div className={styles.loginHint} onClick={() => loginuser()}>
                  {t('donate:loginForRecurrency')}
                </div>
              ) : <></>}


            {project.taxDeductionCountries.length > 0 ? (
              <div className={styles.isTaxDeductible}>
                <div className={styles.isTaxDeductibleText}>
                  {project.taxDeductionCountries.includes(country)
                    ? t('donate:youWillReceiveTaxDeduction')
                    : t('donate:taxDeductionNotYetAvailable')}
                </div>
                <div
                  className={styles.taxDeductible}
                  onClick={() => setOpenTaxDeductionModal(true)}
                  onKeyPress={() => setOpenTaxDeductionModal(true)}
                  role="button"
                  tabIndex={0}
                  data-testid="taxDeductionId"
                >
                  <div className={styles.taxDeductibleCountry}>
                    {t(`country:${country.toLowerCase()}`)}
                  </div>
                  <div className={styles.downArrow}>
                    <DownArrow color="#87B738" />
                  </div>
                </div>
                <div
                  className={styles.isTaxDeductibleText}
                  style={{ marginLeft: '4px' }}
                >
                  {project.taxDeductionCountries.includes(country)
                    ? t('donate:inTimeOfTaxReturns')
                    : null}
                </div>
              </div>
            ) : (
                <div className={styles.isTaxDeductible}>
                  <div className={styles.isTaxDeductibleText}>
                    {t('donate:taxDeductionNotAvailableForProject')}
                  </div>
                </div>
              )}

            <div className={styles.horizontalLine} />

            {paymentError && (
              <div className={styles.paymentError}>{paymentError}</div>
            )}
            {paymentSetup?.gateways?.stripe?.isLive === false ? (
              <div className={styles.paymentError}>
                Test Mode: Your donations will not be charged
              </div>
            ) : null}

            <ShowTreeCount treeCost={treeCost} treeCount={treeCount} currency={currency} recurrencyMnemonic={recurrencyMnemonic} />

            {((treeCost * treeCount) >= minAmt) ? !isPaymentOptionsLoading &&
              paymentSetup?.gateways?.stripe?.account &&
              currency ? (
                <NativePay
                  country={country}
                  currency={currency}
                  amount={formatAmountForStripe(
                    treeCost * treeCount,
                    currency.toLowerCase()
                  )}
                  onPaymentFunction={onPaymentFunction}
                  continueNext={continueNext}
                  paymentSetup={paymentSetup}
                />

              ) : (
                <div className={styles.actionButtonsContainer}>
                  <ButtonLoader />
                  <ButtonLoader />
                </div>
              ) : (
                <div className={styles.finalTreeCount}
                  style={{ marginTop: '5px' }}
                >
                  <div className={styles.totalCostText}
                    style={{ fontWeight: 'unset', marginRight: '6px' }}
                  >
                    <p>{t('donate:minDonate')}</p>
                  </div>
                  <div className={styles.totalCost}>
                    {getFormatedCurrency(i18n.language, currency, minAmt)}
                  </div>
                </div>
              )}
          </div>
          <SelectTaxDeductionCountryModal
            openModal={openTaxDeductionModal}
            handleModalClose={() => setOpenTaxDeductionModal(false)}
            taxDeductionCountries={project.taxDeductionCountries}
            setCountry={setCountry}
            country={country}
            setCurrency={setCurrency}
            currency={currency}
          />
          <SelectCurrencyModal
            openModal={openCurrencyModal}
            handleModalClose={() => setOpenCurrencyModal(false)}
            setCurrency={setCurrency}
            currency={currency}
            setCountry={setCountry}
            country={country}
          />
        </div>
      )
  ) : <></>;
}

export default TreeDonation;

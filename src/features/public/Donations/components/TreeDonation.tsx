import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import { formatAmountForStripe } from '../../../../utils/stripeHelpers';
import PaymentProgress from '../../../common/ContentLoaders/Donations/PaymentProgress';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import { TreeDonationProps } from '../../../common/types/donations';
import SelectCurrencyModal from '../components/treeDonation/SelectCurrencyModal';
import SelectTaxDeductionCountryModal from '../components/treeDonation/SelectTaxDeductionCountryModal';
import DownArrow from './../../../../assets/images/icons/DownArrow';
import Close from './../../../../assets/images/icons/headerIcons/close';
import styles from './../styles/TreeDonation.module.scss';
import { PaymentRequestCustomButton } from './PaymentRequestForm';
import GiftForm from './treeDonation/GiftForm';
import { payWithCard } from './treeDonation/PaymentFunctions';

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
  paymentType,
  setPaymentType,
}: TreeDonationProps): ReactElement {
  const treeCountOptions = [10, 20, 50, 150];
  const [openCurrencyModal, setOpenCurrencyModal] = React.useState(false);
  const [openTaxDeductionModal, setOpenTaxDeductionModal] = React.useState(
    false
  );
  const [paymentError, setPaymentError] = React.useState('');

  const stripeAllowedCountries = [
    'AE',
    'AT',
    'AU',
    'BE',
    'BG',
    'BR',
    'CA',
    'CH',
    'CI',
    'CR',
    'CY',
    'CZ',
    'DE',
    'DK',
    'DO',
    'EE',
    'ES',
    'FI',
    'FR',
    'GB',
    'GR',
    'GT',
    'HK',
    'HU',
    'ID',
    'IE',
    'IN',
    'IT',
    'JP',
    'LT',
    'LU',
    'LV',
    'MT',
    'MX',
    'MY',
    'NL',
    'NO',
    'NZ',
    'PE',
    'PH',
    'PL',
    'PT',
    'RO',
    'SE',
    'SG',
    'SI',
    'SK',
    'SN',
    'TH',
    'TT',
    'US',
    'UY',
  ];
  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const taxDeductSwitchOn = () => {
    setIsTaxDeductible(!isTaxDeductible);
    if (!project.taxDeductionCountries.includes(country)) {
      const displayedCountry = project.taxDeductionCountries[0];
      const respCurrency = getCountryDataBy('countryCode', displayedCountry)
        .currencyCode;
      setCountry(displayedCountry);
      setCurrency(respCurrency);
    }
  };

  const setCustomTreeValue = (e: any) => {
    if (e.target.value === '') {
      // if input is '', default 1
      setTreeCount(1);
    } else {
      if (e.target.value.toString().length <= 12) {
        setTreeCount(e.target.value);
      }
    }
  };

  const continueNext = () => {
    setDonationStep(2);
  };

  const onPaymentFunction = (paymentMethod: any, paymentRequest: any) => {
    setPaymentType(paymentRequest._activeBackingLibraryName);

    let fullName = paymentMethod.billing_details.name;
    fullName = String(fullName).split(' ');
    const firstName = fullName[0];
    fullName.shift();
    let lastName = String(fullName).replace(/,/g, ' ');

    let donorDetails = {
      firstname: firstName,
      lastname: lastName,
      email: paymentMethod.billing_details.email,
      address: paymentMethod.billing_details.address.line1,
      zipCode: paymentMethod.billing_details.address.postal_code,
      city: paymentMethod.billing_details.address.city,
      country: paymentMethod.billing_details.address.country,
    };

    const payWithCardProps = {
      setDonationStep,
      setIsPaymentProcessing,
      project,
      currency,
      treeCost,
      treeCount,
      giftDetails,
      isGift,
      setPaymentError,
      paymentSetup,
      window,
      paymentMethod,
      donorDetails,
    };
    payWithCard({ ...payWithCardProps });
  };

  const [isCustomTrees, setIsCustomTrees] = React.useState(false)
  return isPaymentProcessing ? (
    <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
  ) : (
      <>
        <div
          className={styles.cardContainer}
          style={{ alignSelf: isGift ? 'start' : 'center' }}
        >
          <div className={styles.header}>
            <div onClick={onClose} className={styles.headerCloseIcon}>
              <Close color={styles.primaryFontColor} />
            </div>
            <div className={styles.headerTitle}>Tree Donation</div>
          </div>

          <div className={styles.plantProjectName}>
            To {project.name} by {project.tpo.name}
          </div>

          <div
            className={
              isTaxDeductible ? styles.currencyRateDisabled : styles.currencyRate
            }
            onClick={
              !isTaxDeductible ? () => setOpenCurrencyModal(true) : () => { }
            }
          >
            <div
              className={
                isTaxDeductible ? styles.currencyDisabled : styles.currency
              }
            >
              {currency}
            </div>
            <div className={styles.downArrow}>
              <DownArrow color={isTaxDeductible ? 'grey' : '#87B738'} />
            </div>
            <div className={styles.rate}>
              {Number(treeCost).toFixed(2)} per tree
          </div>
          </div>

          <div className={styles.isGiftDonation}>
            <div className={styles.isGiftDonationText}>
              My donation is a gift to someone
          </div>
            <ToggleSwitch
              checked={isGift}
              onChange={() => setIsGift(!isGift)}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>

          {isGift ? (
            <GiftForm
              isGift={isGift}
              giftDetails={giftDetails}
              setGiftDetails={setGiftDetails}
            />
          ) : null}

          <div className={styles.selectTreeCount}>
            {treeCountOptions.map((option) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setTreeCount(option), setIsCustomTrees(false) }}
                key={option}
                className={
                  treeCount === option && !isCustomTrees
                    ? styles.treeCountOptionSelected
                    : styles.treeCountOption
                }
              >
                <div className={styles.treeCountOptionTrees}>{option}</div>
                <div className={styles.treeCountOptionTrees}>Trees</div>
              </motion.div>
            ))}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={isCustomTrees ? styles.treeCountOptionSelected
                : styles.treeCountOption}
              style={{ minWidth: '65%', flexDirection: 'row' }}
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
                type="text"
                onChange={(e) => setCustomTreeValue(e)}
              />
              <div className={styles.treeCountOptionTrees}>Trees</div>
            </motion.div>
          </div>

          {project.taxDeductionCountries.length > 0 && (
            <React.Fragment>
              <div className={styles.isTaxDeductible}>
                <div className={styles.isTaxDeductibleText}>
                  Send me a tax deduction receipt for
              </div>
                <ToggleSwitch
                  checked={isTaxDeductible}
                  onChange={taxDeductSwitchOn}
                  name="checkedB"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </div>

              <div
                className={
                  isTaxDeductible
                    ? styles.taxDeductible
                    : styles.taxDeductibleDisabled
                }
                onClick={
                  isTaxDeductible
                    ? () => setOpenTaxDeductionModal(true)
                    : () => { }
                }
              >
                <div
                  className={
                    isTaxDeductible
                      ? styles.taxDeductibleCountry
                      : styles.taxDeductibleCountryDisabled
                  }
                >
                  {project.taxDeductionCountries.includes(country)
                    ? getCountryDataBy('countryCode', country).countryName
                    : getCountryDataBy(
                      'countryCode',
                      project.taxDeductionCountries[0]
                    ).countryName}
                </div>
                <div className={styles.downArrow}>
                  <DownArrow color={isTaxDeductible ? '#87B738' : 'grey'} />
                </div>
              </div>
            </React.Fragment>
          )}

          <div className={styles.horizontalLine} />

          {paymentError && (
            <div className={styles.paymentError}>{paymentError}</div>
          )}
          <div className={styles.finalTreeCount}>
            <div className={styles.totalCost}>
              {currency} {Sugar.Number.format(Number(treeCount * treeCost), 2)}
              {/* {(treeCount * treeCost).toFixed(2)}{' '} */}
            </div>
            <div className={styles.totalCostText}>
              for {Sugar.Number.format(Number(treeCount))} Trees
          </div>
          </div>

          <div className={styles.actionButtonsContainer}>
            <div style={{ width: '150px' }}>
              {paymentSetup?.gateways?.stripe?.account &&
                stripeAllowedCountries.includes(country) &&
                currency && (
                  <PaymentRequestCustomButton
                    country={country}
                    currency={currency}
                    amount={formatAmountForStripe(
                      treeCost * treeCount,
                      currency.toLowerCase()
                    )}
                    onPaymentFunction={onPaymentFunction}
                  />
                )}

              {/* {paymentRequest ? 'Or' : null} */}
            </div>

            <AnimatedButton
              onClick={() => continueNext()}
              className={styles.continueButton}
            >
              Continue
          </AnimatedButton>
          </div>
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
      </>
    );
}

export default TreeDonation;


import { motion } from "framer-motion";
import React, { ReactElement } from 'react';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import { formatAmountForStripe } from '../../../../utils/stripeHelpers';
import PaymentProgress from '../../../common/ContentLoaders/Donations/PaymentProgress';
import AnimatedButton from "../../../common/InputTypes/AnimatedButton";
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import { TreeDonationProps } from '../../../common/types/donations';
import {
  createDonation,
  payDonation
} from '../components/treeDonation/PaymentFunctions';
import SelectCurrencyModal from '../components/treeDonation/SelectCurrencyModal';
import SelectTaxDeductionCountryModal from '../components/treeDonation/SelectTaxDeductionCountryModal';
import DownArrow from './../../../../assets/images/icons/DownArrow';
import Close from './../../../../assets/images/icons/headerIcons/close';
import styles from './../styles/TreeDonation.module.scss';
import { PaymentRequestCustomButton } from './PaymentRequestForm';
import GiftForm from './treeDonation/GiftForm';

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
  paymentType, setPaymentType
}: TreeDonationProps): ReactElement {
  const treeCountOptions = [10, 20, 50, 150];
  const [openCurrencyModal, setOpenCurrencyModal] = React.useState(false);
  const [openTaxDeductionModal, setOpenTaxDeductionModal] = React.useState(
    false
  );
  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false)
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
      setTreeCount(0);
    } else {
      setTreeCount(e.target.value);
    }
  };

  const continueNext = () => {
    setDonationStep(2);
  };

  const onPaymentFunction = (paymentMethod: any, paymentRequest: any) => {
    setIsPaymentProcessing(true)
    let createDonationData = {
      type: 'trees',
      project: project.id,
      treeCount: treeCount,
      amount: treeCost * treeCount,
      currency: currency,
      donor: {
        firstname: paymentMethod.billing_details.name,
        lastname: paymentMethod.billing_details.name,
        email: paymentMethod.billing_details.email,
        address: paymentMethod.billing_details.address.line1,
        zipCode: paymentMethod.billing_details.address.postal_code,
        city: paymentMethod.billing_details.address.city,
        country: paymentMethod.billing_details.address.country,
      },
    }
    let gift = {
      gift: {
        type: 'invitation',
        recipientName: giftDetails.firstName,
        recipientEmail: giftDetails.email,
        message: giftDetails.giftMessage
      }
    }
    if (isGift) {
      createDonationData = {
        ...createDonationData,
        ...gift
      }
    }
    setPaymentType(paymentRequest._activeBackingLibraryName);
    createDonation(createDonationData).then((res) => {
      // Code for Payment API
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

      payDonation(payDonationData, res.id).then((res) => {
        if (res.paymentStatus === 'success') {
          setIsPaymentProcessing(false)
          setDonationStep(4);
        }
      });

    });
  }

  return isPaymentProcessing ?
    <PaymentProgress isPaymentProcessing={isPaymentProcessing} />
    : (
      <>
        <motion.div
          animate={{
            scale: [0.94, 1.05, 1],
          }}
          transition={{ duration: 0.8, type: "tween" }}
          className={styles.cardContainer}
          style={{ alignSelf: isGift ? 'start' : 'center' }}
        >
          <div className={styles.header}>
            <div onClick={onClose} className={styles.headerCloseIcon}>
              <Close />
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
              My Donation is a gift to someone
          </div>
            <ToggleSwitch
              checked={isGift}
              onChange={() => setIsGift(!isGift)}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>

          {isGift ? (
            <GiftForm isGift={isGift} giftDetails={giftDetails} setGiftDetails={setGiftDetails} />
          ) : null}

          <div className={styles.selectTreeCount}>
            {treeCountOptions.map((option) => (
              <div
                onClick={() => setTreeCount(option)}
                key={option}
                className={
                  treeCount === option
                    ? styles.treeCountOptionSelected
                    : styles.treeCountOption
                }
              >
                <div className={styles.treeCountOptionTrees}>{option}</div>
                <div className={styles.treeCountOptionTrees}>Trees</div>
              </div>
            ))}
            <div
              className={styles.treeCountOption}
              style={{ minWidth: '65%', flexDirection: 'row' }}
            >
              <input
                className={styles.customTreeInput}
                onInput={(e) => {
                  // replaces any character other than number to blank
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                type="text"
                onChange={(e) => setCustomTreeValue(e)}
              />
              <div className={styles.treeCountOptionTrees}>Trees</div>
            </div>
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

          <div className={styles.finalTreeCount}>
            <div className={styles.totalCost}>
              {currency} {(treeCount * treeCost).toFixed(2)}{' '}
            </div>
            <div className={styles.totalCostText}>for {treeCount} Trees</div>
          </div>

          <div className={styles.actionButtonsContainer}>
            <div style={{ width: '150px' }}>

              <PaymentRequestCustomButton

                country={country}
                currency={currency}
                amount={formatAmountForStripe(
                  treeCost * treeCount,
                  currency.toLowerCase()
                )}
                onPaymentFunction={onPaymentFunction} />
              {/* {paymentRequest ? 'Or' : null} */}
            </div>

            <AnimatedButton onClick={() => continueNext()} className={styles.continueButton}>Continue</AnimatedButton>
          </div>
        </motion.div>
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

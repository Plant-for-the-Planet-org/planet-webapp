import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import { formatAmountForStripe } from '../../../../utils/stripeHelpers';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import GiftForm from '../components/treeDonation/GiftForm';
import {
  createDonation,
  payDonation,
} from '../components/treeDonation/PaymentFunctions';
import SelectCurrencyModal from '../components/treeDonation/SelectCurrencyModal';
import SelectTaxDeductionCountryModal from '../components/treeDonation/SelectTaxDeductionCountryModal';
import DownArrow from './../../../../assets/images/icons/DownArrow';
import Close from './../../../../assets/images/icons/headerIcons/close';
import {
  useOptions,
  usePaymentRequest,
} from './../components/PaymentRequestForm';
import styles from './../styles/TreeDonation.module.scss';

interface Props {
  onClose: any;
  project: any;
}

function TreeDonation({ onClose, project }: Props): ReactElement {
  const treeCountOptions = [10, 20, 50, 150];
  const [treeCount, setTreeCount] = React.useState(50);
  const [isGift, setIsGift] = React.useState(false);
  const [treeCost, setTreeCost] = React.useState(project.treeCost);
  const [paymentSetup, setPaymentSetup] = React.useState();

  // for tax deduction part
  const [isTaxDeductible, setIsTaxDeductible] = React.useState(false);

  // modal for selecting currency
  const [currency, setCurrency] = React.useState(project.currency);
  const [country, setCountry] = React.useState(project.country);
  const [openCurrencyModal, setOpenCurrencyModal] = React.useState(false);
  const [openTaxDeductionModal, setOpenTaxDeductionModal] = React.useState(
    false
  );

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

  // to get country and currency from local storage
  React.useEffect(() => {
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('countryCode')) {
        if (
          project.taxDeductionCountries.includes(
            localStorage.getItem('countryCode') // Use this currency only if it exists in the array
          )
        ) {
          setCountry(localStorage.getItem('countryCode'));
        }
      }
    }
  }, [project]);

  //  to load payment data
  React.useEffect(() => {
    async function loadPaymentSetup() {
      try {
        const res = await fetch(
          `${process.env.API_ENDPOINT}/app/projects/${project.id}/paymentOptions?country=${country}`
        );
        const paymentSetupData = await res.json();
        if (paymentSetupData) {
          setPaymentSetup(paymentSetupData);
          setTreeCost(paymentSetupData.treeCost);
          setCurrency(paymentSetupData.currency);
          setCountry(paymentSetupData.country);
        }
      } catch (err) {
        console.log(err);
      }
    }
    loadPaymentSetup();
  }, [project, country]);

  const setCustomTreeValue = (e: any) => {
    if (e.target.value === '') {
      setTreeCount(0);
    } else {
      setTreeCount(e.target.value);
    }
  };

  const paymentRequest = usePaymentRequest({
    options: {
      country: country,
      currency: currency.toLowerCase(),
      total: {
        label: 'Trees donated to Plant for the Planet',
        amount: formatAmountForStripe(
          treeCost * treeCount,
          currency.toLowerCase()
        ),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    },
    onPaymentMethod: ({ complete, paymentMethod, ...data }: any) => {
      const createDonationData = {
        type: 'trees',
        project: project.id,
        treeCount: treeCount,
        amount: treeCost * treeCount,
        currency: currency,
        donor: {
          firstname: paymentMethod.billing_details.name,
          lastname: paymentMethod.billing_details.name,
          companyname: '',
          email: paymentMethod.billing_details.email,
          address: paymentMethod.billing_details.address.line1,
          zipCode: paymentMethod.billing_details.address.postal_code,
          city: paymentMethod.billing_details.address.city,
          country: paymentMethod.billing_details.address.country,
        },
      };

      createDonation(JSON.stringify(createDonationData)).then((res) => {
        // Code for Payment API
        const payDonationData = {
          paymentProviderRequest: {
            account: paymentSetup.gateways.stripe.account,
            gateway: 'stripe',
            source: {
              id: paymentMethod.id,
              object: 'payment_method',
            },
          },
        };

        payDonation(payDonationData, res.id);
      });
      complete('success');
    },
  });

  const options = useOptions(paymentRequest);

  return (
    <>
      <div
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

        {isTaxDeductible ? (
          // disabled if taxDeduction switch ON
          <div className={styles.currencyRateDisabled}>
            <div className={styles.currencyDisabled}>{currency}</div>
            <div className={styles.downArrow}>
              <DownArrow color={'grey'} />
            </div>
            <div className={styles.rate}>
              {Number(treeCost).toFixed(2)} per tree
            </div>
          </div>
        ) : (
          // enabled if taxDeduction switch OFF
          <div
            className={styles.currencyRate}
            onClick={() => setOpenCurrencyModal(true)}
          >
            <div className={styles.currency}>{currency}</div>
            <div className={styles.downArrow}>
              <DownArrow color={'#87B738'} />
            </div>
            <div className={styles.rate}>
              {Number(treeCost).toFixed(2)} per tree
            </div>
          </div>
        )}

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

        {isGift ? <GiftForm /> : null}

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

            {isTaxDeductible ? (
              // enabled modal if taxDeductible switch ON
              <div
                className={styles.taxDeductible}
                onClick={() => setOpenTaxDeductionModal(true)}
              >
                <div className={styles.taxDeductibleCountry}>
                  {project.taxDeductionCountries.includes(country)
                    ? getCountryDataBy('countryCode', country).countryName
                    : getCountryDataBy(
                        'countryCode',
                        project.taxDeductionCountries[0]
                      ).countryName}
                </div>
                <div className={styles.downArrow}>
                  <DownArrow color={'#87B738'} />
                </div>
              </div>
            ) : (
              // disabled modal if taxDeductible switch OFF
              <div className={styles.taxDeductibleDisabled}>
                <div className={styles.taxDeductibleCountryDisabled}>
                  {project.taxDeductionCountries.includes(country)
                    ? getCountryDataBy('countryCode', country).countryName
                    : getCountryDataBy(
                        'countryCode',
                        project.taxDeductionCountries[0]
                      ).countryName}
                </div>
                <div className={styles.downArrow}>
                  <DownArrow color={'grey'} />
                </div>
              </div>
            )}
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
            {paymentRequest ? (
              <PaymentRequestButtonElement
                className="PaymentRequestButton"
                options={options}
                onReady={() => {
                  console.log('PaymentRequestButton [ready]');
                }}
                onClick={(event) => {
                  console.log('PaymentRequestButton [click]', event);
                }}
                onBlur={() => {
                  console.log('PaymentRequestButton [blur]');
                }}
                onFocus={() => {
                  console.log('PaymentRequestButton [focus]');
                }}
              />
            ) : null}
          </div>
          <div className={styles.continueButton}>Or Continue</div>
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

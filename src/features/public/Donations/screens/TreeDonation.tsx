import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import React, { ReactElement } from 'react';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import { formatAmountForStripe } from '../../../../utils/stripeHelpers';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import GiftForm from '../components/treeDonation/GiftForm';
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
      setCountry(project.taxDeductionCountries[0]);
      setCurrency(respCurrency);
    }
  };

  const [isActive, setActive] = React.useState(false);

  const selectCustomTrees = () => {
    setActive(!isActive);
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

  // for currency modal
  const handleModalOpen = () => {
    setOpenCurrencyModal(true);
  };

  const handleModalClose = () => {
    setOpenCurrencyModal(false);
  };

  // for tax deduction modal
  const handleTaxDeductionModalOpen = () => {
    setOpenTaxDeductionModal(true);
  };

  const handleTaxDeductionModalClose = () => {
    setOpenTaxDeductionModal(false);
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
      // console.log(createDonationData);
      creatDonation(JSON.stringify(createDonationData)).then((res) => {
        // Code for Payment API
        console.log('createDonationData', res);
      });
      console.log('[PaymentMethod]', paymentMethod);
      console.log('[Customer Data]', data);
      complete('success');
    },
  });

  async function creatDonation(data: any) {
    // const res = await fetch(`${process.env.API_ENDPOINT}/app/donations/`, {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    // const donation = await res.json();
    // return donation;
    return { id: 'don_2Hu3V6Yxr0W27d3VMfuitdHM' };
  }

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
          <div className={styles.currencyRate} onClick={handleModalOpen}>
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
                onClick={handleTaxDeductionModalOpen}
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
        handleModalClose={handleTaxDeductionModalClose}
        taxDeductionCountries={project.taxDeductionCountries}
        setCountry={setCountry}
        country={country}
        setCurrency={setCurrency}
        currency={currency}
      />
      <SelectCurrencyModal
        openModal={openCurrencyModal}
        handleModalClose={handleModalClose}
        setCurrency={setCurrency}
        currency={currency}
        setCountry={setCountry}
        country={country}
      />
    </>
  );
}

export default TreeDonation;

// {
//   "id": "pm_1HHyyuGhHD5xN1UqP0Yju0NL",
//   "object": "payment_method",
//   "billing_details": {
//     "address": {
//       "city": "Thane",
//       "country": "IN",
//       "line1": "B-108 Bhairav Shrusti, Bhayandar",
//       "line2": "",
//       "postal_code": "401101",
//       "state": "Maharashtra"
//     },
//     "email": null,
//     "name": "Harsh Vitra",
//     "phone": null
//   },
//   "card": {
//     "brand": "visa",
//     "checks": {
//       "address_line1_check": null,
//       "address_postal_code_check": null,
//       "cvc_check": null
//     },
//     "country": "US",
//     "exp_month": 9,
//     "exp_year": 2023,
//     "funding": "credit",
//     "generated_from": null,
//     "last4": "4242",
//     "networks": {
//       "available": [
//         "visa"
//       ],
//       "preferred": null
//     },
//     "three_d_secure_usage": {
//       "supported": true
//     },
//     "wallet": null
//   },
//   "created": 1597873085,
//   "customer": null,
//   "livemode": false,
//   "metadata": {},
//   "type": "card"
// }

// {
//   "shippingOption": null,
//   "shippingAddress": null,
//   "payerEmail": null,
//   "payerPhone": null,
//   "payerName": null,
//   "methodName": "basic-card"
// }

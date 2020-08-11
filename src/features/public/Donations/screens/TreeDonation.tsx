import Switch from '@material-ui/core/Switch';
import React, { ReactElement } from 'react';
import GpayBlack from '../../../../assets/images/icons/donation/GpayBlack';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import SelectCurrencyModal from '../components/SelectCurrencyModal';
import SelectTaxDeductionCountryModal from '../components/SelectTaxDeductionCountryModal';
import DownArrow from './../../../../assets/images/icons/DownArrow';
import Close from './../../../../assets/images/icons/headerIcons/close';
import MaterialTextFeild from './../../../common/InputTypes/MaterialTextFeild';
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
  const [taxDeductionCountries, setTaxDeductionCountries] = React.useState(
    project.taxDeductionCountries
  );
  // ANCHOR  Why is this added in the State ?

  // modal for selecting currency
  const [currency, setCurrency] = React.useState(project.currency);
  const [country, setCountry] = React.useState(project.country);
  const [openCurrencyModal, setOpenCurrencyModal] = React.useState(false);
  const [openTaxDeductionModal, setOpenTaxDeductionModal] = React.useState(
    false
  );

  console.log(
    'in tree donation component, currency-',
    currency,
    'country-',
    country
  );

  const taxDeductSwitchOn = () => {
    setIsTaxDeductible(!isTaxDeductible);
    if (!taxDeductionCountries.includes(country)) {
      const displayedCountry = taxDeductionCountries[0];
      const respCurrency = getCountryDataBy('countryCode', displayedCountry)
        .currencyCode;
      setCountry(taxDeductionCountries[0]);
      setCurrency(respCurrency);
    }
  };

  // to get country and currency from local storage
  React.useEffect(() => {
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('countryCode')) {
        setCountry(localStorage.getItem('countryCode'));
      }
      if (localStorage.getItem('currencyCode')) {
        if (
          taxDeductionCountries.includes(localStorage.getItem('currencyCode'))
        ) {
          setCurrency(localStorage.getItem('currencyCode')); // Use this currency only if it exists in the array
        }
      }
    }
  }, []);

  //  to load payment data
  React.useEffect(() => {
    async function loadPaymentSetup() {
      try {
        const res = await fetch(
          `${process.env.API_ENDPOINT}/app/projects/${project.id}/paymentOptions?country=${country}`
        );
        const paymentSetupData = await res.json();
        setPaymentSetup(paymentSetupData);
      } catch (err) {
        console.log(err);
      }
    }
    loadPaymentSetup();
  }, [project]);
  console.log('payment SetupData', paymentSetup);

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

  return (
    <div className={styles.treeDonationcontainer}>
      <div className={styles.cardContainer}>
        <div className={styles.header}>
          <div onClick={() => onClose()} className={styles.headerCloseIcon}>
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
              {project.treeCost.toFixed(2)} per tree
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
              {project.treeCost.toFixed(2)} per tree
            </div>
          </div>
        )}

        <div className={styles.isGiftDonation}>
          <div className={styles.isGiftDonationText}>
            My Donation is a gift to someone
          </div>
          <Switch
            checked={isGift}
            onChange={() => setIsGift(!isGift)}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </div>

        {isGift ? (
          <div className={styles.giftsContainer}>
            <div className={styles.singleGiftContainer}>
              <div className={styles.singleGiftTitle}>Gift Recepient</div>
              <div className={styles.formRow}>
                <MaterialTextFeild label="First Name" variant="outlined" />
                <div style={{ width: '20px' }}></div>
                <MaterialTextFeild label="Last Name" variant="outlined" />
              </div>
              <div className={styles.formRow}>
                <MaterialTextFeild label="Email" variant="outlined" />
              </div>
              <div className={styles.formRow}>
                <MaterialTextFeild label="Gift Message" variant="outlined" />
              </div>
            </div>
          </div>
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
              type="text"
              onChange={(e) => setCustomTreeValue(e)}
            />
            <div className={styles.treeCountOptionTrees}>Trees</div>
          </div>
        </div>

        {taxDeductionCountries.length > 0 && (
          <React.Fragment>
            <div className={styles.isTaxDeductible}>
              <div className={styles.isTaxDeductibleText}>
                Send me a tax deduction receipt for
              </div>
              <Switch
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
                  {taxDeductionCountries.includes(country)
                    ? getCountryDataBy('countryCode', country).countryName
                    : getCountryDataBy('countryCode', taxDeductionCountries[0])
                        .countryName}
                </div>
                <div className={styles.downArrow}>
                  <DownArrow color={'#87B738'} />
                </div>
              </div>
            ) : (
              // disabled modal if taxDeductible switch OFF
              <div className={styles.taxDeductibleDisabled}>
                <div className={styles.taxDeductibleCountryDisabled}>
                  {taxDeductionCountries.includes(country)
                    ? getCountryDataBy('countryCode', country).countryName
                    : getCountryDataBy('countryCode', taxDeductionCountries[0])
                        .countryName}
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
          <div>
            <GpayBlack />
          </div>
          <div className={styles.actionButtonsText}>OR</div>
          <div className={styles.continueButton}>Continue</div>
        </div>
      </div>
      <SelectTaxDeductionCountryModal
        openModal={openTaxDeductionModal}
        handleModalClose={handleTaxDeductionModalClose}
        taxDeductionCountries={taxDeductionCountries}
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
    </div>
  );
}

export default TreeDonation;

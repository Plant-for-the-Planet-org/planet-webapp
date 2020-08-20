import React, { ReactElement } from 'react';
import { getCountryDataBy } from '../../../../utils/countryUtils';
import TreeDonation from './TreeDonation';

interface Props {
  onClose: any;
  project: any;
}

function DonationsPopup({ onClose, project }: Props): ReactElement {
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

  return (
    <>
      <TreeDonation project={project} onClose={onClose} />
    </>
  );
}

export default DonationsPopup;

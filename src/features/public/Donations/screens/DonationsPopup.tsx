import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';
import { getRequest } from '../../../../utils/apiRequests/api';
import ContactDetails from '../components/ContactDetails';
import PaymentDetails from '../components/PaymentDetails';
import ThankYou from '../components/ThankYou';
import TreeDonation from '../components/TreeDonation';

interface Props {
  onClose: any;
  project: any;
  directGift: any;
  setDirectGift: any;
}

function DonationsPopup({
  onClose,
  project,
  directGift,
  setDirectGift,
}: Props): ReactElement {
  const [treeCount, setTreeCount] = React.useState(50);
  const [isGift, setIsGift] = React.useState(false);
  const [treeCost, setTreeCost] = React.useState(project.treeCost);
  const [paymentSetup, setPaymentSetup] = React.useState();

  // for tax deduction part
  const [isTaxDeductible, setIsTaxDeductible] = React.useState(false);

  // modal for selecting currency
  const [currency, setCurrency] = React.useState(project.currency);
  const [country, setCountry] = React.useState(
    localStorage.getItem('countryCode')!
  );

  // stores the value as boolean whether payment options is being fetched or not
  // used for showing a loader
  const [isPaymentOptionsLoading, setIsPaymentOptionsLoading] = React.useState<
    boolean
  >(false);

  const [paymentType, setPaymentType] = React.useState('');

  // to get country and currency from local storage
  // React.useEffect(() => {
  //   async function loadData() {
  //     if (typeof Storage !== 'undefined') {
  //       if (localStorage.getItem('countryCode')) {
  //         setCountry(localStorage.getItem('countryCode'));
  //       }
  //     }
  //   }
  //   loadData();
  // }, []);

  //  to load payment data
  React.useEffect(() => {
    async function loadPaymentSetup() {
      try {
        setIsPaymentOptionsLoading(true);

        const paymentSetupData = await getRequest(`/app/projects/${project.id}/paymentOptions?country=${country}`);
        if (paymentSetupData) {
          setPaymentSetup(paymentSetupData);
          setTreeCost(paymentSetupData.treeCost);
          setCurrency(paymentSetupData.currency);
        }
        setIsPaymentOptionsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    loadPaymentSetup();
  }, [project, country]);

  const [donationStep, setDonationStep] = React.useState(1);

  const [giftDetails, setGiftDetails] = React.useState({
    type: null,
    recipientName: null,
    email: null,
    giftMessage: '',
    recipientTreecounter: null,
    receipients: null,
  });

  const [isCompany, setIsCompany] = React.useState(false);

  const [contactDetails, setContactDetails] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    companyName: '',
  });

  const TreeDonationProps = {
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
    paymentType,
    setPaymentType,
    isPaymentOptionsLoading,
  };

  const ContactDetailsProps = {
    treeCount,
    treeCost,
    currency,
    setDonationStep,
    contactDetails,
    setContactDetails,
    isCompany,
    setIsCompany,
    country,
    isTaxDeductible,
  };

  const PaymentDetailsProps = {
    project,
    treeCount,
    treeCost,
    currency,
    setDonationStep,
    contactDetails,
    isGift,
    giftDetails,
    paymentSetup,
    paymentType,
    setPaymentType,
    country,
    isTaxDeductible,
  };

  const ThankYouProps = {
    project,
    treeCount,
    treeCost,
    currency,
    setDonationStep,
    contactDetails,
    isGift,
    giftDetails,
    onClose,
    paymentType,
  };

  React.useEffect(() => {
    if (directGift) {
      setIsGift(true);
      setGiftDetails({
        type: 'direct',
        recipientName: directGift.displayName,
        email: null,
        giftMessage: '',
        recipientTreecounter: directGift.id,
        receipients: null,
      });
    } else {
      setGiftDetails({
        type: null,
        recipientName: null,
        email: null,
        giftMessage: '',
        recipientTreecounter: null,
        receipients: null,
      });
    }
  }, [directGift]);

  switch (donationStep) {
    case 1:
      return (
        <motion.div
          animate={{
            scale: [0.94, 1.05, 1],
          }}
          transition={{ duration: 0.8 }}
        >
          <TreeDonation {...TreeDonationProps} />
        </motion.div>
      );
    case 2:
      return (
        <motion.div
          animate={{
            scale: [0.94, 1.04, 1],
          }}
          transition={{ duration: 0.8 }}
        >
          <ContactDetails {...ContactDetailsProps} />
        </motion.div>
      );
    case 3:
      return (
        <motion.div
          animate={{
            scale: [0.94, 1.05, 1],
          }}
          transition={{ duration: 0.8 }}
        >
          <PaymentDetails {...PaymentDetailsProps} />
        </motion.div>
      );
    case 4:
      return (
        <motion.div
          animate={{
            scale: [0.94, 1.04, 1],
            rotate: [-15, 5, 0],
          }}
          transition={{ duration: 0.8 }}
        >
          <ThankYou {...ThankYouProps} />
        </motion.div>
      );
    default:
      return (
        <motion.div
          animate={{
            scale: [0.94, 1.05, 1],
          }}
          transition={{ duration: 0.8 }}
        >
          <TreeDonation {...TreeDonationProps} />
        </motion.div>
      );
  }
}

export default DonationsPopup;

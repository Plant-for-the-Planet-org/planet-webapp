import React, { ReactElement } from 'react';
import { getRequest, getAccountInfo } from '../../utils/apiRequests/api';
import ContactDetails from './screens/ContactDetails';
import PaymentDetails from './screens/PaymentDetails';
import ThankYou from './screens/ThankYou';
import TreeDonation from './screens/TreeDonation';
import { UserPropsContext } from '../common/Layout/UserPropsContext';

interface Props {
  onClose: any;
  project: any;
}

function DonationsPopup({ onClose, project }: Props): ReactElement {
  const [treeCount, setTreeCount] = React.useState(50);
  const [isGift, setIsGift] = React.useState(false);
  const [treeCost, setTreeCost] = React.useState(project.treeCost);
  const [paymentSetup, setPaymentSetup] = React.useState();
  const [donationID, setDonationID] = React.useState(null);
  const [shouldCreateDonation, setShouldCreateDonation] = React.useState(false);

  const { user, contextLoaded, loginWithRedirect, token } = React.useContext(
    UserPropsContext
  );

  // for tax deduction part
  const [isTaxDeductible, setIsTaxDeductible] = React.useState(false);

  // modal for selecting currency
  const [currency, setCurrency] = React.useState(project.currency);
  const [country, setCountry] = React.useState(
    typeof window !== 'undefined' ? localStorage.getItem('countryCode') : 'DE'
  );

  // stores the value as boolean whether payment options is being fetched or not
  // used for showing a loader
  const [isPaymentOptionsLoading, setIsPaymentOptionsLoading] = React.useState<
    boolean
  >(false);

  const [paymentType, setPaymentType] = React.useState('');

  const [directGift, setDirectGift] = React.useState(null);
  React.useEffect(() => {
    const getdirectGift = localStorage.getItem('directGift');
    if (getdirectGift) {
      setDirectGift(JSON.parse(getdirectGift));
    }
  }, []);

  //  to load payment data
  React.useEffect(() => {
    async function loadPaymentSetup() {
      try {
        setIsPaymentOptionsLoading(true);

        const paymentSetupData = await getRequest(
          `/app/projects/${project.id}/paymentOptions?country=${country}`
        );
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

  // This effect is used to get and update UserInfo if the isAuthenticated changes
  React.useEffect(() => {
    async function loadFunction() {
      const defaultDetails = {
        firstName: user.firstname ? user.firstname : '',
        lastName: user.lastname ? user.lastname : '',
        email: user.email ? user.email : '',
        address: user.address.address ? user.address.address : '',
        city: user.address.city ? user.address.city : '',
        zipCode: user.address.zipCode ? user.address.zipCode : '',
        country: '',
        companyName: '',
        isPrivate: user.isPrivate,
        type: user.type,
      };
      setContactDetails(defaultDetails);
    }
    if (contextLoaded && user) {
      loadFunction();
    }
  }, [contextLoaded && user]);

  React.useEffect(() => {
    setShouldCreateDonation(true);
  }, [
    paymentSetup,
    treeCount,
    isGift,
    giftDetails,
    contactDetails.firstName,
    contactDetails.lastName,
    contactDetails.email,
    contactDetails.address,
    contactDetails.city,
    contactDetails.zipCode,
    contactDetails.firstName,
    contactDetails.country,
    contactDetails.companyName,
    isTaxDeductible,
  ]);

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
    token,
    donationID,
    setDonationID,
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
    project,
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
    token,
    donationID,
    setDonationID,
    shouldCreateDonation,
    setShouldCreateDonation,
  };

  const ThankYouProps = {
    donationID,
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
      setIsGift(false);
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
        <div>
          <TreeDonation {...TreeDonationProps} />
        </div>
      );
    case 2:
      return (
        <div>
          <ContactDetails {...ContactDetailsProps} />
        </div>
      );
    case 3:
      return (
        <div>
          <PaymentDetails {...PaymentDetailsProps} />
        </div>
      );
    case 4:
      return (
        <div>
          <ThankYou {...ThankYouProps} />
        </div>
      );
    default:
      return (
        <div>
          <TreeDonation {...TreeDonationProps} />
        </div>
      );
  }
}

export default DonationsPopup;

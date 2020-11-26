export interface contactDetailsProps {
  firstName: string;
  lastName: string;
  email: string;
  address: String;
  city: String;
  zipCode: String;
  country: String;
  companyName: String;
}

export interface giftDetailsProps {
  type:String|null;
  recipientName: String|null;
  email: String|null;
  giftMessage: String|null;
  recipientTreecounter: Number|null;
  receipients: {}|null;
}

export interface TreeDonationProps {
  onClose: any;
  project: any;
  treeCount: number;
  setTreeCount: Function;
  isGift: Boolean;
  setIsGift: Function;
  treeCost: number;
  paymentSetup: any;
  isTaxDeductible: Boolean;
  setIsTaxDeductible: Function;
  currency: String;
  setCurrency: Function;
  country: string;
  setCountry: Function;
  setDonationStep: Function;
  giftDetails: giftDetailsProps;
  setGiftDetails: Function;
  directGift:any,
  setDirectGift: Function;
  paymentType: String;
  setPaymentType: Function;
  isPaymentOptionsLoading: boolean;
  token:any;
}

export interface PaymentDetailsProps {
  project: { id: any };
  paymentSetup: any;
  treeCount: number;
  treeCost: number;
  currency: String;
  setDonationStep: Function;
  contactDetails: contactDetailsProps;
  isGift: Boolean;
  giftDetails: giftDetailsProps;
  paymentType: String;
  setPaymentType: Function;
  country: string;
  isTaxDeductible: Boolean;
  token:any;
}

export interface ContactDetailsPageProps {
  treeCount: number;
  treeCost: number;
  currency: String;
  setDonationStep: Function;
  contactDetails: contactDetailsProps;
  setContactDetails: Function;
  isCompany: Boolean;
  setIsCompany: Function;
  country: string;
  isTaxDeductible: Boolean;
}

export interface ThankYouProps {
  project: { name: String };
  treeCount: number;
  treeCost: number;
  currency: String;
  setDonationStep: Function;
  contactDetails: Object;
  isGift: Boolean;
  giftDetails: giftDetailsProps;
  onClose: any;
  paymentType: String;
}

export interface PayWithCardTypes {
  setIsPaymentProcessing: Function;
  setPaymentError: Function;
  project: Object;
  treeCount: number;
  treeCost: number;
  currency: String;
  giftDetails: giftDetailsProps;
  isGift: Boolean;
  paymentSetup: Object;
  window: any;
  setDonationStep: Function;
  paymentMethod: Object;
  donorDetails: Object;
  taxDeductionCountry: string | null;
  token: any | null;
}

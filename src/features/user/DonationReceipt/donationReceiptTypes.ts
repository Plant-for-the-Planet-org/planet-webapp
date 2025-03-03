export const RECEIPT_STATUS = {
  VERIFY: 'verify',
  DOWNLOAD: 'download',
  ISSUE: 'issue',
} as const;

export const UNISSUED_RECEIPT_TYPE = {
  PENDING: 'pending',
  MULTI: 'multi',
  SINGLE: 'single',
} as const;

export type Donation = {
  amount: number;
  currency: string;
  paymentDate: string;
  reference: string;
};

export type DonorView = {
  tin: string | null;
  name: string;
  type: 'individual' | 'organization' | null;
};

export type AddressView = {
  city: string | null;
  country: string | null;
  zipCode: string | null;
  address1: string | null;
  address2: string | null;
};

export type Operation = (typeof RECEIPT_STATUS)[keyof typeof RECEIPT_STATUS];

// latest API

export interface DonorAPI {
  reference: string;
  tin: string | null;
  type: 'individual' | 'organization';
  name: string;
  email: string;
  address1: string;
  address2: string | null;
  city: string;
  zipCode: string;
  country: string;
  guid: string | null;
}

export interface IssuedReceiptDataApi {
  amount: number;
  challenge: string;
  country: string;
  currency: string;
  donationCount: number;
  donations: IssuedDonationApi[];
  donor: DonorApi;
  downloadUrl: string;
  dtn: string;
  paymentDate: string;
  reference: string;
  tinIsRequired: boolean | null;
  verificationDate: string | null;
  year: string;
}

export interface ReceiptData {
  address: AddressView;
  amount: number;
  challenge: string | null;
  country: string;
  currency: string;
  donationCount: number;
  donations: DonationView[];
  donor: DonorView;
  downloadUrl: string | null;
  dtn: string | null;
  isVerified: boolean;
  paymentDate: string;
  type: string | null;
  year: string | null;
}

// receipt list

export interface DonationReceiptsStatus {
  issued: IssuedReceiptDataApi[];
  unissued: UnissuedReceiptDataAPI[];
}

export interface UnissuedReceiptDataAPI {
  amount: number;
  currency: string;
  country: string;
  donationCount: number;
  issuableDate: string;
  donations: UnissuedDonationApi[];
  paymentDate: string;
  template: string;
  tinIsRequired: boolean;
  type: 'multi' | 'single' | 'pending';
  uids: string[];
  year: number;
}

export interface IssuedDonationApi {
  amount: number;
  currency: string;
  paymentDate: string;
  reference: string;
}

export interface UnissuedDonationApi {
  amount: number;
  currency: string;
  paymentDate: string;
  uid: string;
}

export interface DonorApi {
  address1: string | null;
  address2: string | null;
  city: string | null;
  country: string | null;
  email: string;
  name: string;
  reference: string;
  tin: string | null;
  type: string; // e.g., "individual" or "organization"
  zipCode: string;
}

export interface DonationView {
  reference: string;
  amount: number;
  currency: string;
  paymentDate: string;
}

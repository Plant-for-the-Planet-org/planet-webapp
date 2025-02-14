import type { RECEIPT_STATUS } from './utils';

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
  city: string;
  country: string;
  zipCode: string;
  address1: string;
  address2: string | null;
  guid: string | null;
};

interface ReceiptDataBase {
  dtn: string;
  year: string;
  challenge: string;
  currency: string;
  amount: number;
  verificationDate: string | null;
  downloadUrl: string;
  donations: Donation[];
}

export interface ReceiptData extends ReceiptDataBase {
  operation: 'download' | 'verify';
  donor: DonorView;
  address: AddressView;
  hasDonorDataChanged: boolean; // Set it to true if the user modifies the data during the receipt verification process
}

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
}

export interface ReceiptDataAPI extends ReceiptDataBase {
  paymentDate: string;
  donationCount: number;
  country: string;
  donor: DonorAPI;
  issueDate: string;
  reference: string;
  status: string;
  template: 'single' | 'summary';
}

// receipt list

export interface DonationReceiptsStatus {
  issued: Issued[];
  unissued: Unissued[];
}

export interface Issued {
  dtn: string;
  issueDate: string;
  challenge: string;
  year: string;
  country: string;
  reference: string;
  amount: number;
  currency: string;
  paymentDate: string;
  verificationDate: string | null;
  donor: DonorAPI;
  downloadUrl: string;
  donationCount: number;
  donations: Donation[];
  status: string;
  template: string;
}

export interface Unissued {
  amount: string;
  country: string;
  currency: string;
  donationCount: number;
  issuableDate: string;
  donations: UnissuedDonation[];
  paymentDate: string;
  template: string;
  tinIsRequired: boolean;
  type: string;
  uids: string[];
  year: number;
}

export interface UnissuedDonation {
  amount: number;
  currency: string;
  groupMode: string;
  isEndowment: boolean;
  issuableDate: string;
  paymentDate: string;
  purpose: string;
  tinIsRequired: boolean;
  uid: string;
}

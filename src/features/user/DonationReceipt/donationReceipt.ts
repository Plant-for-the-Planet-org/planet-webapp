export type DonationView = {
  amount: number;
  currency?: string; // need to update
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

type ReceiptDataBase = {
  dtn: string;
  year: string;
  challenge: string;
  amount: number;
  currency: string;
  paymentDate: string;
  verificationDate: string | null;
  downloadUrl: string;
  donationCount: number;
};

export interface ReceiptData extends ReceiptDataBase {
  operation: 'download' | 'verify';
  donor: DonorView;
  address: AddressView;
  donations: DonationView[];
  hasDonorDataChanged: boolean; // Set it to true if the user modifies the data during the receipt verification process
}

// latest API

export interface DonationAPI {
  amount: number;
  paymentDate: string;
  reference: string;
}

export type DonorAPI = {
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
};
export interface UnverifiedReceiptDataAPI {
  amount: number;
  challenge: string;
  year: string;
  dtn: string;
  donations: DonationAPI[];
  donor: DonorAPI;
}

export interface VerifiedReceiptDataAPI extends UnverifiedReceiptDataAPI {
  country: string;
  currency: string;
  donationCount: number;
  downloadUrl: string;
  issueDate: string;
  paymentDate: string;
  reference: string;
  status: string;
  template: string;
  verificationDate: string;
}

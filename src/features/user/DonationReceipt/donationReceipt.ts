export type Donations = {
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
};

interface ReceiptDataBase {
  dtn: string;
  year: string;
  challenge: string;
  amount: number;
  verificationDate: string | null;
  downloadUrl: string;
  donations: Donations[];
}

export interface ReceiptData extends ReceiptDataBase {
  operation: 'download' | 'verify';
  donor: DonorView;
  address: AddressView;
  hasDonorDataChanged: boolean; // Set it to true if the user modifies the data during the receipt verification process
}

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
  currency: string;
  donationCount: number;
  country: string;
  donor: DonorAPI;
  issueDate: string;
  reference: string;
  status: string;
  template: 'single' | 'summary';
}

import type { ProjectPurpose, UnitTypes } from '@planet-sdk/common';

export interface Fees {
  disputeFee: number;
  planetFee: number;
  transactionFee: number;
  transferFee: number;
}

export interface BankAccount {
  beneficiary: string;
  iban: string;
  bic: string;
  bankName: string;
  swift: string;
}

export interface RecipientBank {
  bankName?: string;
  accountHolder?: string;
  iban?: string;
  bic?: string;
  aba?: string;
  swift?: string;
  isDefault?: string | number;
  created?: Date;
  updated?: Date;
}

export interface PaymentDetails {
  donorName: string;
  quantity: number;
  method: string;
  created: Date;
  unitCost: number;
  lastUpdate: Date;
  project: string;
  paidAmount: number;
  refundAmount?: number;
  donorCertificate?: string;
  taxDeductibleReceipt?: string;
  account?: BankAccount;
  paymentDate?: Date;
  totalAmount?: number;
  fees?: Fees;
  recipientBank?: RecipientBank;
  codesUrl?: string;
  giftOccasion?: string;
  giftCertificate?: string;
  giftComment?: string;
  giftMessage?: string;
  giftRecipient?: string;
  bouquetDonation?: string;
}

export interface Links {
  self: string;
  first: string;
  last: string;
  next: string;
}

interface Filters {
  [key: string]: string;
}

export interface Filters {
  all: string;
  'donation-all': string;
  'payout-all': string;
  completed: string;
  'in-progress': string;
  'tree-cash': string;
  'action-required': string;
}

export type SingleDestination = {
  id: string;
  name?: string;
  type: 'project' | 'planet-cash';
  amount: number;
};

export type MultipleDestinations = {
  type: 'mixed';
  items: SingleDestination[];
};

export type Destination = SingleDestination | MultipleDestinations;

export interface FirstDonation {
  created: Date;
  reference: string;
}

export type DonationPurpose = ProjectPurpose | 'composite';

export interface PaymentHistoryRecord {
  quantity: number;
  bouquetPurpose?: string;
  netAmount: number;
  purpose: DonationPurpose;
  created: Date;
  treeCount: number;
  type: string;
  reference: string;
  lastUpdate: Date;
  projectGuid: string;
  currency: string;
  details: PaymentDetails;
  status: string;
  unitType: UnitTypes;
}

export interface PaymentHistory {
  items: PaymentHistoryRecord[];
  total: number;
  count: number;
  _links: Links;
  _filters: Filters;
}

export interface Subscription {
  id: string;
  totalDonated: number;
  amount: number;
  destination: Destination;
  method: string;
  needsActivation: boolean;
  firstDonation: FirstDonation;
  paymentGateway: string;
  cycleType: string;
  frequency: string;
  currency: string;
  startDate?: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialPeriodStart: string;
  trialPeriodEnd: string;
  endsAt?: string | null;
  status: string;
  isSynced: boolean;
  pauseUntil?: string | null;
  donorName?: string;
  bankAccount: BankAccount | null;
}

export interface ModifyDonations
  extends Omit<
    Subscription,
    | 'startDate'
    | 'currentPeriodStart'
    | 'currentPeriodEnd'
    | 'trialPeriodStart'
    | 'trialPeriodStart'
    | 'endsAt'
    | 'donorName'
  > {
  lastUpdate: string;
  bankAccount: BankAccount;
}

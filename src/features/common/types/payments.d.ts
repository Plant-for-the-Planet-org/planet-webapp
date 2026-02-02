import type { ProjectPurpose, UnitTypes, Nullable } from '@planet-sdk/common';
import type { DateString } from './common';

export interface Fees {
  disputeFee: Nullable<number>;
  planetFee: Nullable<number>;
  transactionFee: Nullable<number>;
  transferFee: Nullable<number>;
}

export interface BankAccount {
  beneficiary?: string;
  iban?: string;
  bic?: string;
  bankName?: string;
  swift?: string;
}

export interface RecipientBank {
  bankName?: string;
  accountHolder?: string;
  iban?: string;
  bic?: string;
  aba?: string;
  swift?: string;
  isDefault?: string | number;
  /** ISO 8601 format like "2025-09-14T07:55:22+00:00" */
  created?: DateString;
  /** ISO 8601 format like "2025-09-14T07:55:22+00:00" */
  updated?: DateString;
}

export interface PaymentDetails {
  /** @deprecated Likely deprecation */
  donorName?: Nullable<string>;
  quantity: Nullable<number>;
  method: string;
  /** ISO 8601 format like "2025-09-14T07:55:22+00:00" */
  created: DateString;
  unitCost: number;
  /** ISO 8601 format like "2025-09-14T07:55:22+00:00" */
  lastUpdate: DateString;
  /** Can be null for planet-cash/composite donations */
  project: Nullable<string>;
  paidAmount: number;
  refundAmount?: Nullable<number>;
  donorCertificate?: Nullable<string>;
  taxDeductibleReceipt?: Nullable<string>;
  account?: BankAccount;
  /** ISO 8601 format like "2025-09-14T07:55:22+00:00" */
  paymentDate?: DateString;
  totalAmount?: number;
  fees?: Fees;
  recipientBank?: RecipientBank;
  codesUrl?: Nullable<string>;
  giftOccasion?: Nullable<string>;
  giftCertificate?: Nullable<string>;
  giftComment?: Nullable<string>;
  giftMessage?: Nullable<string>;
  giftRecipient?: Nullable<string>;
  bouquetDonation?: Nullable<string>;
  /** Present only for recurring donations, pointing to first donation in the series. Else null */
  firstDonation?: Nullable<string>;
}

export interface Links {
  self: string;
  first: string;
  last: string;
  next?: string;
  prev?: string;
}

interface Filters {
  [key: string]: string;
}

export interface Filters {
  all: string;
  'donation-all': string;
  'payout-all'?: string;
  completed: string;
  'in-progress'?: string;
  pending?: string;
  failed?: string;
  'planet-cash': string;
  'action-required'?: string;
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

export type DonationPurpose =
  | ProjectPurpose
  | 'composite'
  | 'academy'
  | 'endowment'
  | 'forest-protection'
  | 'sponsorship'
  | 'membership';

export interface PaymentHistoryRecord {
  quantity: Nullable<number>;
  bouquetPurpose?: Nullable<string>;
  netAmount: number;
  purpose: DonationPurpose;
  /** ISO 8601 format like "2025-09-14T07:55:22+00:00" */
  created: DateString;
  treeCount: Nullable<number>;
  type: string;
  reference: string;
  /** ISO 8601 format like "2025-09-14T07:55:22+00:00" */
  lastUpdate: DateString;
  /** Present for TPO users only */
  projectGuid?: string;
  currency: string;
  details: PaymentDetails;
  status: string;
  unitType: Nullable<UnitTypes>;
}

export interface PaymentHistory {
  items: PaymentHistoryRecord[];
  total: number;
  count: number;
  _links: Links;
  _filters: Filters;
}
export interface Project {
  id: string;
  name: string;
  amount: number;
}
export interface Subscription {
  id: string;
  lastUpdate: string;
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
  startDate: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialPeriodStart: string | null;
  trialPeriodEnd: string | null;
  endsAt: string | null;
  status:
    | 'incomplete'
    | 'active'
    | 'trialing'
    | 'paused'
    | 'canceled'
    | 'incomplete_expired'
    | 'past_due'
    | 'unpaid';
  isSynced: boolean;
  pauseUntil: string | null;
  donorName?: string;
  bankAccount: BankAccount | null;
  project: Project;
  type: string;
}

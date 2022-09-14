declare namespace Payments {
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
    giftCertificate?: string;
    account?: BankAccount;
    paymentDate?: Date;
    totalAmount?: number;
    fees?: Fees;
    recipientBank?: RecipientBank;
    codesUrl?: string;
    giftOccasion?: string;
    giftComment?: string;
  }

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

  export interface PaymentHistoryRecord {
    quantity: number;
    bouquetPurpose?: string;
    netAmount: number;
    purpose: string;
    created: Date;
    treeCount: number;
    type: string;
    reference: string;
    lastUpdate: Date;
    projectGuid: string;
    currency: string;
    details: PaymentDetails;
    status: string;
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

  export interface PaymentHistory {
    items: PaymentHistoryRecord[];
    total: number;
    count: number;
    _links: Links;
    _filters: Filters;
  }

  export interface Destination {
    id: string;
    name?: string;
    type: string;
  }

  export interface FirstDonation {
    created: Date;
    reference: string;
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
    startDate?: any;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    trialPeriodStart: string;
    trialPeriodEnd: string;
    endsAt?: any;
    status: string;
    isSynced: boolean;
    pauseUntil?: any;
    donorName?: string;
  }
}

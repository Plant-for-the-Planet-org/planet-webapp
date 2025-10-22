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
  template: 'single' | 'summary' | 'endowment';
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
  lastConsolidatedYear: number;
}

export interface UnissuedReceiptDataAPI {
  amount: number;
  currency: string;
  country: string;
  donationCount: number;
  issuableDate: string;
  donations: UnissuedDonationApi[];
  paymentDate: string;
  template: 'single' | 'summary' | 'endowment';
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

// Yearly grouping interfaces

/**
 * Interface for yearly grouped receipts structure
 * Groups receipts by year with separate arrays for issued and unissued receipts
 */
export interface YearlyGroupedReceipts {
  [year: string]: {
    issued: IssuedReceiptDataApi[];
    unissued: UnissuedReceiptDataAPI[];
  };
}

/**
 * Overview button states
 */
export type OverviewButtonState = 'hidden' | 'active' | 'inactive-unverified' | 'inactive-future';

/**
 * Interface for overview receipt eligibility
 * Determines if a year is eligible for overview receipt download
 */
export interface OverviewEligibility {
  year: string;
  isEligible: boolean;
  verifiedCount: number;
  totalCount: number;
  isConsolidated: boolean;
  buttonState: OverviewButtonState;
  hoverMessage?: string;
}

// Component prop interfaces

/**
 * Props for YearlyReceiptGroup component
 */
export interface YearlyReceiptGroupProps {
  year: string;
  receipts: {
    issued: IssuedReceiptDataApi[];
    unissued: UnissuedReceiptDataAPI[];
  };
  onReceiptClick: (type: 'issued' | 'unissued', receipt: IssuedReceiptDataApi | UnissuedReceiptDataAPI) => void;
  processReceiptId: string | null;
  overviewButtonState: OverviewButtonState;
  onOverviewDownload?: () => void;
  isOverviewLoading?: boolean;
  hoverMessage?: string;
}

/**
 * Props for YearHeader component
 */
export interface YearHeaderProps {
  year: string;
  overviewButtonState: OverviewButtonState;
  onOverviewDownload?: () => void;
  isLoading?: boolean;
  hoverMessage?: string;
}

/**
 * API response for overview receipt download
 */
export interface OverviewReceiptDownloadResponse {
  downloadUrl: string;
}

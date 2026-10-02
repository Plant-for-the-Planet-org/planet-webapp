// TODO - review types and make more specific where possible
import type { CountryCode, CurrencyCode } from '@planet-sdk/common';

export interface PaymentOptionsBase {
  currency: CurrencyCode;
  unitCost: number;
  id: string;
  name: string;
}

export interface TreePaymentOptions extends PaymentOptionsBase {
  purpose: 'trees';
  unitType: 'tree' | 'm2';
}

export interface ConservationPaymentOptions extends PaymentOptionsBase {
  purpose: 'conservation';
  unitType: 'm2';
}

export interface FundPaymentOptions extends PaymentOptionsBase {
  purpose: 'funds';
  unitType: 'currency';
}

export type PaymentOptions =
  | TreePaymentOptions
  | ConservationPaymentOptions
  | FundPaymentOptions;

// A row parsed from the uploaded recipient CSV/XLSX, before it is turned into a donation payload.
export interface RecipientUploadRow {
  recipient_name: string;
  recipient_email: string;
  recipient_notify: string;
  units: string;
  recipient_message: string;
  // recipient_occasion: string;
}

// The recipient shape sent to the donations API.
export interface RecipientPayload {
  units: number;
  recipientName: string;
  recipientEmail: string;
  message: string;
  notifyRecipient: boolean;
  // occasion: string;
}

// The subset of a PlanetCash account needed to issue bulk codes.
export interface BulkCodesPlanetCashAccount {
  guid: string;
  currency: CurrencyCode;
  country: CountryCode;
}

type TableHeader = {
  key: keyof RecipientUploadRow;
  displayText: string;
  helpText?: string;
};

interface OtherRecipientProperties {
  [key: string]: string;
}

type ExtendedRecipient = RecipientUploadRow & OtherRecipientProperties;

type FileImportErrorCode =
  | 'fileInvalidType'
  | 'fileTooLarge'
  | 'fileTooSmall'
  | 'tooManyFiles'
  | 'missingColumns'
  | 'noRecipientData'
  | 'tooManyRecipients'
  | 'unitsNotProvided'
  | 'notifyNotPossible'
  | 'invalidEmails'
  | 'longRecipientNames'
  | 'instructionRowError'
  | 'generalError';

export interface FileImportError {
  type: FileImportErrorCode;
  message: string;
}

export type UploadStates = 'empty' | 'processing' | 'success' | 'error';

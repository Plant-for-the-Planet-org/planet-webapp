// TODO - review types and make more specific where possible
import type { CurrencyCode, UnitTypes } from '@planet-sdk/common';

export interface PaymentOptionsBase {
  currency: CurrencyCode;
  unitCost: number;
  purpose: 'trees' | 'conservation' | 'funds';
  id: string;
  name: string;
  unitType: UnitTypes;
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

export interface Recipient {
  recipient_name: string;
  recipient_email: string;
  recipient_notify: string;
  units: string;
  recipient_message: string;
  // recipient_occasion: string;
}

type TableHeader = {
  key: keyof Recipient;
  displayText: string;
  helpText?: string;
};

interface OtherRecipientProperties {
  [key: string]: string;
}

type ExtendedRecipient = Recipient & OtherRecipientProperties;

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

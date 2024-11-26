// TODO - review types and make more specific where possible
import type { CurrencyCode } from '@planet-sdk/common';

export interface PaymentOptions {
  currency: CurrencyCode;
  unitCost: number;
  purpose: string;
  id: string;
  name: string;
  unit: 'tree' | 'm2' | 'ha';
}

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

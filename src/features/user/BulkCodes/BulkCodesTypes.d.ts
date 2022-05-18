export interface Recipient {
  recipient_name: string;
  recipient_email: string;
  recipient_notify: string;
  units: string;
  recipient_message: string;
  recipient_occasion: string;
}

type FileImportErrorCode =
  | 'fileInvalidType'
  | 'fileTooLarge'
  | 'fileTooSmall'
  | 'tooManyFiles'
  | 'missingColumns'
  | 'generalError';

export interface FileImportError {
  type: FileImportErrorCode;
  missingColumns?: string[];
}

export type UploadStates = 'empty' | 'processing' | 'success' | 'error';

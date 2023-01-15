import { useState, ReactElement, useEffect } from 'react';
import { parse, ParseResult } from 'papaparse';
import { useTranslation, Trans } from 'next-i18next';
import UploadWidget from './UploadWidget';
import RecipientsTable from './RecipientsTable';
import {
  Recipient,
  FileImportError,
  UploadStates,
  ExtendedRecipient,
} from '../BulkCodesTypes';

import styles from '../BulkCodes.module.scss';
import { isEmailValid } from '../../../../utils/isEmailValid';

const acceptedHeaders: (keyof Recipient)[] = [
  'recipient_name',
  'recipient_email',
  'recipient_notify',
  'units',
  'recipient_message',
  /* 'recipient_occasion', */
];

const MAX_RECIPIENTS = 1000;

interface RecipientsUploadFormProps {
  onRecipientsUploaded: (recipients: Recipient[]) => void;
  localRecipients: Recipient[];
}

const RecipientsUploadForm = ({
  onRecipientsUploaded,
  localRecipients,
}: RecipientsUploadFormProps): ReactElement => {
  const [status, setStatus] = useState<UploadStates>('empty');
  const [parseError, setParseError] = useState<FileImportError | null>(null);
  const [hasIgnoredColumns, setHasIgnoredColumns] = useState(false);
  const [headers, setHeaders] = useState<(keyof Recipient)[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>(
    localRecipients as Recipient[]
  );
  const { t, ready } = useTranslation(['bulkCodes']);

  const handleStatusChange = (newStatus: UploadStates) => {
    setStatus(newStatus);
    if (newStatus !== 'success') {
      setRecipients([]);
    }
  };

  const checkHeaderValidity = (
    headers: string[]
  ): { isValid: boolean; missingColumns: string[] } => {
    let isValid = true;
    const missingColumns = [];
    for (const acceptedHeader of acceptedHeaders) {
      if (!headers.includes(acceptedHeader)) {
        isValid = false;
        missingColumns.push(acceptedHeader);
      }
    }
    return {
      isValid,
      missingColumns,
    };
  };

  const validateRecipients = (
    recipients: ExtendedRecipient[]
  ): Recipient[] | false => {
    //   Check recipient data is present
    if (!recipients.length) {
      setParseError({
        type: 'noRecipientData',
        message: ready ? t('bulkCodes:errorUploadCSV.noRecipientData') : '',
      });
      return false;
    }

    // Check max limit for recipients
    if (recipients.length > MAX_RECIPIENTS) {
      setParseError({
        type: 'tooManyRecipients',
        message: ready ? t('bulkCodes:errorUploadCSV.tooManyRecipients') : '',
      });
      return false;
    }

    // Check if first row has not been deleted
    const firstRow = recipients[0];
    if (
      firstRow.units === 'number - mandatory' ||
      isNaN(Number(firstRow.units))
    ) {
      setParseError({
        type: 'instructionRowError',
        message: ready ? t('bulkCodes:errorUploadCSV.instructionRowError') : '',
      });
      return false;
    }

    // Check recipient has "units" field, and this is a number
    const hasUnits = recipients.every((recipient) => {
      const units = Number(recipient.units);
      return Number.isInteger(units) && units > 0;
    });

    if (!hasUnits) {
      setParseError({
        type: 'unitsNotProvided',
        message: ready ? t('bulkCodes:errorUploadCSV.unitsNotProvided') : '',
      });
      return false;
    }

    // Check that email and name are provided if notify is true
    const isNotifyPossible = recipients.every((recipient) => {
      const { recipient_name, recipient_email, recipient_notify } = recipient;
      return (
        recipient_notify !== 'yes' ||
        (recipient_notify === 'yes' &&
          recipient_name.length &&
          recipient_email.length)
      );
    });

    if (!isNotifyPossible) {
      setParseError({
        type: 'notifyNotPossible',
        message: ready ? t('bulkCodes:errorUploadCSV.notifyNotPossible') : '',
      });
      return false;
    }

    // Check if email is valid
    const invalidEmailIndexes: number[] = [];
    recipients.forEach((recipient, index) => {
      const { recipient_email } = recipient;
      if (!isEmailValid(recipient_email) && recipient_email.length !== 0) {
        invalidEmailIndexes.push(index + 1);
      }
    });

    if (invalidEmailIndexes.length > 0) {
      setParseError({
        type: 'invalidEmails',
        message: ready
          ? t('bulkCodes:errorUploadCSV.invalidEmails', {
              rowList: invalidEmailIndexes.join(', '),
            })
          : '',
      });
      return false;
    }

    return recipients.map((recipient) => {
      return {
        recipient_name: recipient['recipient_name'],
        recipient_email: recipient['recipient_email'],
        recipient_notify: recipient['recipient_notify'],
        recipient_message: recipient['recipient_message'],
        /* recipient_occasion: recipient['recipient_occasion'], */
        units: recipient['units'],
      };
    });
  };

  const processFileContents = (fileContents: string) => {
    parse(fileContents, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results: ParseResult<unknown>) => {
        if (!results.errors.length) {
          const parsedHeaders = results.meta.fields || [];
          const parsedData = results.data;
          const headerValidity = checkHeaderValidity(parsedHeaders);
          if (headerValidity.isValid) {
            setHeaders(acceptedHeaders);

            // Check if any columns in uploaded csv were ignored
            parsedHeaders.length > 5 //To be updated when occasion is added
              ? setHasIgnoredColumns(true)
              : setHasIgnoredColumns(false);

            const validatedRecipients = validateRecipients(
              parsedData as ExtendedRecipient[]
            );

            if (validatedRecipients) {
              setRecipients(validatedRecipients);
              setParseError(null);
              handleStatusChange('success');
            }
          } else {
            setParseError({
              type: 'missingColumns',
              message: ready
                ? `${t(
                    'bulkCodes:errorUploadCSV.missingColumns'
                  )} ${headerValidity.missingColumns.join(', ')}`
                : '',
            });
          }
        } else {
          const error = results.errors[0];
          if (error.row === 0 && error.code === 'TooManyFields') {
            setParseError({
              type: 'instructionRowError',
              message: ready
                ? t('bulkCodes:errorUploadCSV.instructionRowError')
                : '',
            });
          } else {
            setParseError({
              type: 'generalError',
              message: ready ? t('bulkCodes:errorUploadCSV.generalError') : '',
            });
          }
        }
      },
    });
  };

  useEffect(() => {
    onRecipientsUploaded(recipients);
  }, [recipients]);

  return (
    <>
      <UploadWidget
        status={status}
        onStatusChange={handleStatusChange}
        onFileUploaded={processFileContents}
        parseError={parseError}
        hasIgnoredColumns={hasIgnoredColumns}
      />
      <p className={styles.uploadInstructions}>
        <Trans i18nKey="bulkCodes:importInstructions">
          Please refer to the{' '}
          <a
            target="_blank"
            href="https://plantfortheplanet.notion.site/Bulk-Codes-Public-Documentation-edbcb42b80db415d87245ffc0aecd1e8"
            rel="noreferrer"
          >
            documentation here
          </a>
          , download{' '}
          <a href="/assets/recipient-upload-sample.xlsx">Excel template here</a>
          , and{' '}
          <a href="/assets/recipient-upload-sample.csv">CSV template here</a>
        </Trans>
      </p>
      {recipients.length > 0 && (
        <RecipientsTable headers={headers} recipients={recipients} />
      )}
    </>
  );
};

export default RecipientsUploadForm;

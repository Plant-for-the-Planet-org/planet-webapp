import { useState, ReactElement, useEffect } from 'react';
import { parse, ParseResult } from 'papaparse';
import i18next from '../../../../../i18n';

import UploadWidget from './UploadWidget';
import RecipientsTable from './RecipientsTable';
import {
  Recipient,
  FileImportError,
  UploadStates,
  ExtendedRecipient,
} from '../BulkCodesTypes';

import styles from '../BulkCodes.module.scss';

const { useTranslation } = i18next;

const acceptedHeaders = [
  'recipient_name',
  'recipient_email',
  'recipient_notify',
  'units',
  'recipient_message',
  'recipient_occasion',
];

interface RecipientsUploadFormProps {
  onRecipientsUploaded: (recipients: Object[]) => void;
  localRecipients: Object[];
}

const RecipientsUploadForm = ({
  onRecipientsUploaded,
  localRecipients,
}: RecipientsUploadFormProps): ReactElement => {
  const [status, setStatus] = useState<UploadStates>('empty');
  const [parseError, setParseError] = useState<FileImportError | null>(null);
  const [hasIgnoredColumns, setHasIgnoredColumns] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [recipients, setRecipients] = useState<Object[]>(localRecipients);
  const { t, ready } = useTranslation(['bulkCodes']);

  const handleStatusChange = (newStatus: UploadStates) => {
    setStatus(newStatus);
    if (newStatus !== 'success') {
      console.log('new status', newStatus);
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
      const emailRegex =
        /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i;
      if (!emailRegex.test(recipient_email) && recipient_email.length !== 0)
        invalidEmailIndexes.push(index + 1);
    });

    if (invalidEmailIndexes.length > 0) {
      setParseError({
        type: 'invalidEmails',
        message: ready
          ? `${t(
              'bulkCodes:errorUploadCSV.invalidEmails'
            )} ${invalidEmailIndexes.join(', ')}`
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
        recipient_occasion: recipient['recipient_occasion'],
        units: recipient['units'],
      };
    });
  };

  const processFileContents = (fileContents: string) => {
    parse(fileContents, {
      header: true,
      complete: (results: ParseResult<unknown>) => {
        if (!results.errors.length) {
          const parsedHeaders = results.meta.fields || [];
          const parsedData = results.data;
          const headerValidity = checkHeaderValidity(parsedHeaders);
          if (headerValidity.isValid) {
            setHeaders(acceptedHeaders);

            // Check if any columns in uploaded csv were ignored
            parsedHeaders.length > 6
              ? setHasIgnoredColumns(true)
              : setHasIgnoredColumns(false);

            //Ignore first row which contains help instructions
            const recipients = parsedData.slice(1);
            const validatedRecipients = validateRecipients(
              recipients as ExtendedRecipient[]
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
          setParseError({
            type: 'generalError',
            message: ready ? t('bulkCodes:errorUploadCSV.generalError') : '',
          });
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
        Please refer to the documentation{' '}
        <a href="#" className={styles.uploadInstructionLink}>
          here
        </a>
        , and download{' '}
        <a
          href="/Bulk Code - Sample CSVs/Valid CSV.csv"
          className={styles.uploadInstructionLink}
        >
          template here
        </a>
      </p>
      {recipients.length > 0 && (
        <RecipientsTable headers={headers} recipients={recipients} />
      )}
    </>
  );
};

export default RecipientsUploadForm;

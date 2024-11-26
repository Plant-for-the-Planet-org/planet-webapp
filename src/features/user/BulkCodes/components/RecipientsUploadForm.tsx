import type { ReactElement } from 'react';
import type { ParseResult } from 'papaparse';
import type { SetState } from '../../../common/types/common';
import type {
  Recipient,
  TableHeader,
  FileImportError,
  UploadStates,
  ExtendedRecipient,
} from '../BulkCodesTypes';

import { useState, useMemo } from 'react';
import { parse } from 'papaparse';
import { useTranslations } from 'next-intl';
import UploadWidget from './UploadWidget';
import RecipientsTable from './RecipientsTable';
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
const RECIPIENT_NAME_MAX_LENGTH = 35;

interface RecipientsUploadFormProps {
  setLocalRecipients: SetState<Recipient[]>;
  localRecipients: Recipient[];
  setIsAddingRecipient: SetState<boolean>;
  setIsEditingRecipient: SetState<boolean>;
}

const RecipientsUploadForm = ({
  setLocalRecipients,
  localRecipients,
  setIsAddingRecipient,
  setIsEditingRecipient,
}: RecipientsUploadFormProps): ReactElement => {
  const t = useTranslations('BulkCodes');

  const [status, setStatus] = useState<UploadStates>('empty');
  const [parseError, setParseError] = useState<FileImportError | null>(null);
  const [hasIgnoredColumns, setHasIgnoredColumns] = useState(false);
  const headers = useMemo<TableHeader[]>(() => {
    return acceptedHeaders.map((header) => ({
      key: header,
      displayText: t(`tableHeaders.${header}`),
      helpText: t(`tableHeaderHelpText.${header}`),
    }));
  }, [t]);

  const handleStatusChange = (newStatus: UploadStates) => {
    setStatus(newStatus);
    if (newStatus !== 'success') {
      setLocalRecipients([]);
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
        message: t('errorUploadCSV.noRecipientData'),
      });
      return false;
    }

    // Check max limit for recipients
    if (recipients.length > MAX_RECIPIENTS) {
      setParseError({
        type: 'tooManyRecipients',
        message: t('errorUploadCSV.tooManyRecipients'),
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
        message: t('errorUploadCSV.instructionRowError'),
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
        message: t('errorUploadCSV.unitsNotProvided'),
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
        message: t('errorUploadCSV.notifyNotPossible'),
      });
      return false;
    }

    // Check if email is valid
    const invalidEmailIndexes: number[] = [];
    const longRecipientNameIndexes: number[] = [];

    recipients.forEach((recipient, index) => {
      const { recipient_email, recipient_name } = recipient;
      if (!isEmailValid(recipient_email) && recipient_email.length !== 0) {
        invalidEmailIndexes.push(index + 1);
      }
      if (recipient_name.length > RECIPIENT_NAME_MAX_LENGTH) {
        longRecipientNameIndexes.push(index + 1);
      }
    });

    if (invalidEmailIndexes.length > 0) {
      setParseError({
        type: 'invalidEmails',
        message: t('errorUploadCSV.invalidEmails', {
          rowList: invalidEmailIndexes.join(', '),
        }),
      });
      return false;
    }

    if (longRecipientNameIndexes.length > 0) {
      setParseError({
        type: 'longRecipientNames',
        message: t('errorUploadCSV.longRecipientNames', {
          rowList: longRecipientNameIndexes.join(', '),
        }),
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

  const processFileContents = (fileContents: string): void => {
    parse(fileContents, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results: ParseResult<unknown>) => {
        if (!results.errors.length) {
          const parsedHeaders = results.meta.fields || [];
          const parsedData = results.data;
          const headerValidity = checkHeaderValidity(parsedHeaders);
          if (headerValidity.isValid) {
            // Check if any columns in uploaded csv were ignored
            parsedHeaders.length > 5 //To be updated when occasion is added
              ? setHasIgnoredColumns(true)
              : setHasIgnoredColumns(false);

            const validatedRecipients = validateRecipients(
              parsedData as ExtendedRecipient[]
            );

            if (validatedRecipients) {
              setLocalRecipients(validatedRecipients);
              setParseError(null);
              handleStatusChange('success');
            }
          } else {
            setParseError({
              type: 'missingColumns',
              message: `${t(
                'errorUploadCSV.missingColumns'
              )} ${headerValidity.missingColumns.join(', ')}`,
            });
          }
        } else {
          const error = results.errors[0];
          if (error.row === 0 && error.code === 'TooManyFields') {
            setParseError({
              type: 'instructionRowError',
              message: t('errorUploadCSV.instructionRowError'),
            });
          } else {
            setParseError({
              type: 'generalError',
              message: t('errorUploadCSV.generalError'),
            });
          }
        }
      },
    });
  };

  return (
    <>
      <UploadWidget
        status={status}
        onStatusChange={handleStatusChange}
        onFileUploaded={processFileContents}
        parseError={parseError}
        hasIgnoredColumns={hasIgnoredColumns}
        shouldWarn={localRecipients.length > 0}
      />
      <p className={styles.uploadInstructions}>
        {t.rich('importInstructions', {
          docsLink: (chunks) => (
            <a
              target="_blank"
              href="https://plantfortheplanet.notion.site/Bulk-Codes-Public-Documentation-edbcb42b80db415d87245ffc0aecd1e8"
              rel="noreferrer"
            >
              {chunks}
            </a>
          ),
          excelLink: (chunks) => (
            <a href="/assets/recipient-upload-sample.xlsx">{chunks}</a>
          ),
          csvLink: (chunks) => (
            <a href="/assets/recipient-upload-sample.csv">{chunks}</a>
          ),
        })}
      </p>
      <RecipientsTable
        headers={headers}
        localRecipients={localRecipients}
        setLocalRecipients={setLocalRecipients}
        canAddRecipients={localRecipients.length < MAX_RECIPIENTS}
        setIsAddingRecipient={setIsAddingRecipient}
        setIsEditingRecipient={setIsEditingRecipient}
      />
    </>
  );
};

export default RecipientsUploadForm;

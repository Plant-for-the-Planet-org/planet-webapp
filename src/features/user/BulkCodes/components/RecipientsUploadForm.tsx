import { useState, ReactElement, useEffect } from 'react';
import { parse, ParseResult } from 'papaparse';

import UploadWidget from './UploadWidget';
import RecipientsTable from './RecipientsTable';
import { Recipient, FileImportError, UploadStates } from '../BulkCodesTypes';

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

  const processFileContents = (fileContents: string) => {
    parse(fileContents, {
      header: true,
      complete: (results: ParseResult<unknown>) => {
        if (!results.errors.length) {
          const parsedHeaders = results.meta.fields || [];
          const parsedData = results.data;
          const headerValidity = checkHeaderValidity(parsedHeaders);
          console.log(headerValidity);
          if (headerValidity.isValid) {
            setHeaders(acceptedHeaders);
            parsedHeaders.length > 6
              ? setHasIgnoredColumns(true)
              : setHasIgnoredColumns(false);
            setRecipients(
              parsedData
                .filter((_data, index) => index !== 0) //Ignore first row which contains help instructions
                .map((recipient: any) => {
                  return {
                    recipient_name: recipient['recipient_name'],
                    recipient_email: recipient['recipient_email'],
                    recipient_notify: recipient['recipient_notify'],
                    recipient_message: recipient['recipient_message'],
                    recipient_occasion: recipient['recipient_occasion'],
                    units: recipient['units'],
                  };
                })
            );
            setParseError(null);
            handleStatusChange('success');
          } else {
            setParseError({
              type: 'missingColumns',
              missingColumns: headerValidity.missingColumns,
            });
            handleStatusChange('error');
          }
        } else {
          setParseError({ type: 'generalError' });
          handleStatusChange('error');
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
      {recipients.length > 0 && (
        <RecipientsTable headers={headers} recipients={recipients} />
      )}
    </>
  );
};

export default RecipientsUploadForm;

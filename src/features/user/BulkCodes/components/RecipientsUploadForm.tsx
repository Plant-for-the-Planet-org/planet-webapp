import { useState, ReactElement, useEffect } from 'react';
import { parse, ParseResult } from 'papaparse';

import UploadWidget, { UploadStates } from './UploadWidget';

interface RecipientsUploadFormProps {
  onRecipientsUploaded: (recipients: Object[]) => void;
  currentRecipients: Object[];
}

const RecipientsUploadForm = ({
  onRecipientsUploaded,
  currentRecipients,
}: RecipientsUploadFormProps): ReactElement => {
  const [status, setStatus] = useState<UploadStates>('empty');
  const [parseError, setParseError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [recipients, setRecipients] = useState<Object[]>(currentRecipients);

  const handleStatusChange = (newStatus: UploadStates) => {
    setStatus(newStatus);
  };

  const checkHeaderValidity = (headers: string[]): boolean => {
    let isValid = true;
    const validHeaders = [
      'recipient_name',
      'recipient_email',
      'recipient_notify',
      'recipient_message',
      'recipient_occasion',
      'units',
    ];
    for (const validHeader of validHeaders) {
      if (!headers.includes(validHeader)) {
        isValid = false;
      }
    }
    return isValid;
  };

  const processFileContents = (fileContents: string) => {
    parse(fileContents, {
      header: true,
      complete: (results: ParseResult<unknown>) => {
        if (!results.errors.length) {
          const parsedHeaders = results.meta.fields;
          const parsedData = results.data;
          console.log(parsedData, parsedHeaders);
          if (parsedHeaders && checkHeaderValidity(parsedHeaders)) {
            setHeaders(
              parsedHeaders.filter((header) => {
                return [
                  'recipient_name',
                  'recipient_email',
                  'recipient_notify',
                  'recipient_message',
                  'recipient_occasion',
                  'units',
                ].includes(header);
              })
            );
            setRecipients(
              parsedData
                .filter((_data, index) => index !== 0)
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
            setParseError('unexpectedColumn');
            handleStatusChange('error');
          }
        } else {
          setParseError('generalError');
          handleStatusChange('error');
        }
      },
    });
  };

  useEffect(() => {
    onRecipientsUploaded(recipients);
  }, [recipients]);

  return (
    <UploadWidget
      status={status}
      onStatusChange={handleStatusChange}
      onFileUploaded={processFileContents}
      parseError={parseError ? parseError : undefined}
    />
  );
};

export default RecipientsUploadForm;

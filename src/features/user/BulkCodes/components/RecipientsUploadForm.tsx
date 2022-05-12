import { useState, ReactElement } from 'react';
import { parse, ParseResult } from 'papaparse';

import UploadWidget, { UploadStates } from './UploadWidget';

const RecipientsUploadForm = (): ReactElement => {
  const [status, setStatus] = useState<UploadStates>('empty');
  const [parseError, setParseError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [recipients, setRecipients] = useState<Object[]>([]);

  const handleStatusChange = (newStatus: UploadStates) => {
    setStatus(newStatus);
  };

  const processFileContents = (fileContents: string) => {
    parse(fileContents, {
      header: true,
      complete: (results: ParseResult<unknown>) => {
        if (!results.errors.length) {
          const parsedHeaders = results.meta.fields;
          const parsedData = results.data;
          if (
            parsedHeaders &&
            parsedHeaders.length &&
            parsedHeaders.includes('units')
          ) {
            console.log(parsedHeaders);
            console.log(parsedData);
            /*setHeaders(
              parsedHeaders.filter((header) => {
                return [
                  'recipient_name',
                  'recipient_email',
                  'recipient_notify',
                  'recipient_message',
                  'recipient_occassion',
                  'units',
                ].includes(header);
              })
            );
            parsedData.forEach(() => {}); */
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

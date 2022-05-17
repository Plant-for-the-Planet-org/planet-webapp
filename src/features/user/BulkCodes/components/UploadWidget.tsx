import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDropzone, ErrorCode } from 'react-dropzone';
import i18next from '../../../../../i18n';

import FileUploadIcon from '../../../../../public/assets/images/icons/FileUploadIcon';
import FileProcessingIcon from '../../../../../public/assets/images/icons/FileProcessingIcon';
import FileAttachedIcon from '../../../../../public/assets/images/icons/FileAttachedIcon';

import { FileImportError, UploadStates } from '../BulkCodesTypes';

import styles from '../BulkCodes.module.scss';

const { useTranslation } = i18next;

interface UploadWidgetInterface {
  status: UploadStates;
  onFileUploaded: (fileContents: string) => void;
  onStatusChange: (newStatus: UploadStates, error?: Object) => void;
  parseError: FileImportError | null;
  hasIgnoredColumns: boolean;
}

const UploadWidget = ({
  status = 'empty',
  onStatusChange,
  onFileUploaded,
  parseError,
  hasIgnoredColumns,
}: UploadWidgetInterface): ReactElement | null => {
  const { t, ready } = useTranslation(['bulkCodes']);
  const [error, setError] = useState<FileImportError | null>(null);

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    onStatusChange('processing');
    const reader = new FileReader();
    reader.readAsText(acceptedFiles[0]);
    reader.onabort = () => handleError('file reading was aborted');
    reader.onerror = () => handleError('file reading has failed');
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const csv = event.target?.result;
      onFileUploaded(csv as string);
    };
    setError(null);
  }, []);

  const onDropRejected = useCallback((fileRejections) => {
    const error = fileRejections[0].errors[0].code;
    handleError(error);
  }, []);

  useEffect(() => {
    if (parseError) {
      handleError(parseError.type);
    }
  }, [parseError]);

  const handleError = (errorType: string) => {
    switch (errorType) {
      case ErrorCode.FileInvalidType:
        setError({ type: 'fileInvalidType' });
        break;
      case ErrorCode.TooManyFiles:
        setError({ type: 'tooManyFiles' });
        break;
      case ErrorCode.FileTooLarge:
        setError({ type: 'fileTooLarge' });
        break;
      case ErrorCode.FileTooSmall:
        setError({ type: 'fileTooSmall' });
        break;
      case 'missingColumns':
        if (parseError) setError({ ...parseError });
        break;
      default:
        setError({ type: 'generalError' });
        break;
    }
    onStatusChange('error');
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv',
    multiple: false,
    minSize: 1,
    maxSize: 5242880,
    onDropRejected: onDropRejected,
    onDropAccepted: onDropAccepted,
  });

  const renderWidgetIcon = (status: UploadStates) => {
    switch (status) {
      case 'success':
        return <FileAttachedIcon />;
      case 'processing':
        return <FileProcessingIcon />;
      case 'empty':
      case 'error':
      default:
        return <FileUploadIcon />;
    }
  };

  const renderStatusText = (
    status: UploadStates,
    error: FileImportError | null,
    hasIgnoredColumns: boolean
  ) => {
    let statusText;
    switch (status) {
      case 'success':
        statusText = t(`bulkCodes:statusUploadCSV.${status}`);
        if (hasIgnoredColumns) {
          statusText = statusText.concat(
            ' - ',
            t('bulkCodes:successUploadCSV.ignoredColumns')
          );
        }
        break;
      case 'error':
        statusText = `${t(`bulkCodes:statusUploadCSV.${status}`)} - ${t(
          `bulkCodes:errorUploadCSV.${error?.type}`
        )}`;
        if (error && error.type === 'missingColumns' && error.missingColumns) {
          statusText = statusText.concat(error.missingColumns.join(', '));
        }
        break;
      default:
        return null;
    }
    return (
      <div className={styles[`uploadWidget__statusText--${status}`]}>
        {statusText}
      </div>
    );
  };

  if (ready) {
    return (
      <div
        {...getRootProps({
          className: `${styles.uploadWidget} ${
            styles[`uploadWidget--${status}`]
          }`,
        })}
      >
        <input {...getInputProps()} />
        {renderWidgetIcon(status)}
        {renderStatusText(status, error, hasIgnoredColumns)}
        <p>{t(`bulkCodes:instructionsUploadCSV.${status}`)}</p>
      </div>
    );
  }
  return null;
};

export default UploadWidget;

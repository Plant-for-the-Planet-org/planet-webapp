import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDropzone, ErrorCode } from 'react-dropzone';
import i18next from '../../../../../i18n';

import FileUploadIcon from '../../../../../public/assets/images/icons/FileUploadIcon';
import FileProcessingIcon from '../../../../../public/assets/images/icons/FileProcessingIcon';
import FileAttachedIcon from '../../../../../public/assets/images/icons/FileAttachedIcon';

import styles from '../BulkCodes.module.scss';

const { useTranslation } = i18next;

export type UploadStates = 'empty' | 'processing' | 'success' | 'error';

interface UploadWidgetInterface {
  status: UploadStates;
  onFileUploaded: (fileContents: string) => void;
  onStatusChange: (newStatus: UploadStates, error?: Object) => void;
  parseError?: string;
}

const UploadWidget = ({
  status = 'empty',
  onStatusChange,
  onFileUploaded,
  parseError,
}: UploadWidgetInterface): ReactElement | null => {
  const { t, ready } = useTranslation(['bulkCodes']);
  const [error, setError] = useState<string | null>(null);

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
      handleError(parseError);
    }
  }, [parseError]);

  const handleError = useCallback((error: string) => {
    switch (error) {
      case ErrorCode.FileInvalidType:
        setError('fileInvalidType');
        break;
      case ErrorCode.TooManyFiles:
        setError('tooManyFiles');
        break;
      case ErrorCode.FileTooLarge:
        setError('fileTooLarge');
        break;
      case ErrorCode.FileTooSmall:
        setError('fileTooSmall');
        break;
      case 'unexpectedColumn':
        setError('unexpectedColumn');
        break;
      default:
        setError('generalError');
        break;
    }
    onStatusChange('error');
  }, []);

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

  const renderStatusText = (status: UploadStates) => {
    if (['success', 'error'].includes(status)) {
      return (
        <div className={styles[`uploadWidget__statusText--${status}`]}>
          {t(`bulkCodes:statusUploadCSV.${status}`)}
          {status === 'error'
            ? ` - ${t(`bulkCodes:errorUploadCSV.${error}`)}`
            : ''}
        </div>
      );
    }

    return null;
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
        {renderStatusText(status)}
        <p>{t(`bulkCodes:instructionsUploadCSV.${status}`)}</p>
      </div>
    );
  }
  return null;
};

export default UploadWidget;

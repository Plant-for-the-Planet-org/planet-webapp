import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDropzone, ErrorCode } from 'react-dropzone';
import { useTranslation } from 'next-i18next';
import FileUploadIcon from '../../../../../public/assets/images/icons/FileUploadIcon';
import FileProcessingIcon from '../../../../../public/assets/images/icons/FileProcessingIcon';
import FileAttachedIcon from '../../../../../public/assets/images/icons/FileAttachedIcon';
import { FileImportError, UploadStates } from '../BulkCodesTypes';
import styles from '../BulkCodes.module.scss';
import handleFileUpload from '../../../../utils/handleFileUpload';

interface UploadWidgetInterface {
  status: UploadStates;
  onFileUploaded: (fileContents: string) => void;
  onStatusChange: (newStatus: UploadStates) => void;
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
    handleFileUpload(acceptedFiles[0], handleUploadError, onFileUploaded);
    setError(null);
  }, []);

  const onDropRejected = useCallback((fileRejections) => {
    const error = fileRejections[0].errors[0].code;
    handleUploadError(error);
  }, []);

  useEffect(() => {
    if (parseError) {
      handleUploadError('parseError', parseError);
    }
  }, [parseError]);

  const handleUploadError = (errorType: string, error?: FileImportError) => {
    switch (errorType) {
      case ErrorCode.FileInvalidType:
        setError({
          type: 'fileInvalidType',
          message: t('bulkCodes:errorUploadCSV.fileInvalidType'),
        });
        break;
      case ErrorCode.TooManyFiles:
        setError({
          type: 'tooManyFiles',
          message: t('bulkCodes:errorUploadCSV.tooManyFiles'),
        });
        break;
      case ErrorCode.FileTooLarge:
        setError({
          type: 'fileTooLarge',
          message: t('bulkCodes:errorUploadCSV.fileTooLarge'),
        });
        break;
      case ErrorCode.FileTooSmall:
        setError({
          type: 'fileTooSmall',
          message: t('bulkCodes:errorUploadCSV.fileTooSmall'),
        });
        break;
      case 'parseError':
        if (error) setError({ ...error });
        else
          setError({
            type: 'generalError',
            message: t('bulkCodes:errorUploadCSV.generalError'),
          });
        break;
      default:
        setError({
          type: 'generalError',
          message: t('bulkCodes:errorUploadCSV.generalError'),
        });
        break;
    }
    onStatusChange('error');
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['.csv', '.xlsx'],
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
        statusText = `${t(`bulkCodes:statusUploadCSV.${status}`)} - ${
          error?.message
        }`;
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

import type { ReactElement } from 'react';
import type { FileRejection } from 'react-dropzone';
import type { FileImportError, UploadStates } from '../BulkCodesTypes';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone, ErrorCode } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import FileUploadIcon from '../../../../../public/assets/images/icons/FileUploadIcon';
import FileProcessingIcon from '../../../../../public/assets/images/icons/FileProcessingIcon';
import FileAttachedIcon from '../../../../../public/assets/images/icons/FileAttachedIcon';
import LiveRegion from '../../../common/LiveRegion';
import styles from '../BulkCodes.module.scss';
import handleFileUpload from '../../../../utils/handleFileUpload';

interface UploadWidgetInterface {
  status?: UploadStates;
  onFileUploaded: (fileContents: string) => void;
  onStatusChange: (newStatus: UploadStates) => void;
  parseError?: FileImportError | null;
  hasIgnoredColumns?: boolean;
  shouldWarn?: boolean;
}

const UploadWidget = ({
  status = 'empty',
  onStatusChange,
  onFileUploaded,
  parseError = null,
  hasIgnoredColumns = false,
  shouldWarn = false,
}: UploadWidgetInterface): ReactElement | null => {
  const t = useTranslations('BulkCodes');
  const [error, setError] = useState<FileImportError | null>(null);

  const handleUploadError = (errorType: string, error?: FileImportError) => {
    switch (errorType) {
      case ErrorCode.FileInvalidType:
        setError({
          type: 'fileInvalidType',
          message: t('errorUploadCSV.fileInvalidType'),
        });
        break;
      case ErrorCode.TooManyFiles:
        setError({
          type: 'tooManyFiles',
          message: t('errorUploadCSV.tooManyFiles'),
        });
        break;
      case ErrorCode.FileTooLarge:
        setError({
          type: 'fileTooLarge',
          message: t('errorUploadCSV.fileTooLarge'),
        });
        break;
      case ErrorCode.FileTooSmall:
        setError({
          type: 'fileTooSmall',
          message: t('errorUploadCSV.fileTooSmall'),
        });
        break;
      case 'parseError':
        if (error) setError({ ...error });
        else
          setError({
            type: 'generalError',
            message: t('errorUploadCSV.generalError'),
          });
        break;
      default:
        setError({
          type: 'generalError',
          message: t('errorUploadCSV.generalError'),
        });
        break;
    }
    onStatusChange('error');
  };

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    onStatusChange('processing');
    handleFileUpload(acceptedFiles[0], handleUploadError, onFileUploaded);
    setError(null);
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const error = fileRejections[0].errors[0].code;
    handleUploadError(error);
  }, []);

  useEffect(() => {
    if (parseError) {
      handleUploadError('parseError', parseError);
    }
  }, [parseError]);

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
        statusText = t(`statusUploadCSV.${status}`);
        if (hasIgnoredColumns) {
          statusText = statusText.concat(
            ' - ',
            t('successUploadCSV.ignoredColumns')
          );
        }
        break;
      case 'error':
        statusText = `${t(`statusUploadCSV.${status}`)} - ${error?.message}`;
        break;
      default:
        return null;
    }
    // An upload error is assertive (the action failed and needs a retry);
    // success is polite. `key` remounts the region on a status change so the
    // new message is a fresh insertion and is reliably announced.
    return (
      <LiveRegion
        key={status}
        politeness={status === 'error' ? 'assertive' : 'polite'}
        className={styles[`uploadWidget__statusText--${status}`]}
      >
        {statusText}
      </LiveRegion>
    );
  };

  return (
    <div
      {...getRootProps({
        onClick: (e) => {
          if (shouldWarn) {
            const shouldContinue = confirm(t('fileUploadWarning'));
            if (!shouldContinue) e.stopPropagation();
          }
        },
        className: `${styles.uploadWidget} ${
          status === 'error' ? styles[`uploadWidget--${status}`] : ''
        }`,
        // Marks the widget as working while the file is parsed.
        'aria-busy': status === 'processing',
      })}
    >
      <input {...getInputProps()} />
      {renderWidgetIcon(status)}
      {renderStatusText(status, error, hasIgnoredColumns)}
      <p>{t(`instructionsUploadCSV.${status}`)}</p>
    </div>
  );
};

export default UploadWidget;

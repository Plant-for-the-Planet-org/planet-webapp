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

  const getStatusText = (
    status: UploadStates,
    error: FileImportError | null,
    hasIgnoredColumns: boolean
  ) => {
    switch (status) {
      case 'success': {
        const successText = t(`statusUploadCSV.${status}`);
        return hasIgnoredColumns
          ? successText.concat(' - ', t('successUploadCSV.ignoredColumns'))
          : successText;
      }
      case 'error':
        return `${t(`statusUploadCSV.${status}`)} - ${error?.message}`;
      default:
        return null;
    }
  };

  const statusText = getStatusText(status, error, hasIgnoredColumns);

  const renderStatusText = () => {
    if (statusText === null) return null;
    // An upload error is assertive: the action failed and needs a retry. An
    // alert inserted with its text is reliably announced, so this one carries
    // the visible message directly. Success is handled by the persistent
    // polite region below, so it renders as plain text here.
    return status === 'error' ? (
      <LiveRegion
        politeness="assertive"
        className={styles[`uploadWidget__statusText--${status}`]}
      >
        {statusText}
      </LiveRegion>
    ) : (
      <div className={styles[`uploadWidget__statusText--${status}`]}>
        {statusText}
      </div>
    );
  };

  return (
    <>
      {/* This is a `polite` message because a successful upload is a result, not an
    error.

    Keep the live region outside the dropzone for two reasons. First, the
    dropzone uses `aria-busy` while parsing, and screen readers may not
    announce updates inside a busy element. Second, keeping the live region on
    the page means screen readers announce the updated text more reliably than
    if the live region is added with the message.

    Separate live regions are used for success and error messages, so there is
    no need to switch between `role="status"` and `role="alert"` on the same
    element.

    The live region is visually hidden, so it does not affect the widget's
    layout. */}
      <LiveRegion politeness="polite" isVisuallyHidden>
        {status === 'success' ? statusText : ''}
      </LiveRegion>
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
        {renderStatusText()}
        <p>{t(`instructionsUploadCSV.${status}`)}</p>
      </div>
    </>
  );
};

export default UploadWidget;

import { ReactElement } from 'react';
import { useDropzone } from 'react-dropzone';
import i18next from '../../../../../i18n';

import FileUploadIcon from '../../../../../public/assets/images/icons/FileUploadIcon';
import FileProcessingIcon from '../../../../../public/assets/images/icons/FileProcessingIcon';
import FileAttachedIcon from '../../../../../public/assets/images/icons/FileAttachedIcon';

import styles from '../BulkCodes.module.scss';

const { useTranslation } = i18next;

type UploadStatus = 'empty' | 'processing' | 'success' | 'error';

interface UploadWidgetInterface {
  status: UploadStatus;
}

const UploadWidget = ({
  status = 'empty',
}: UploadWidgetInterface): ReactElement | null => {
  const { t, ready } = useTranslation(['bulkCodes']);
  const { getRootProps, getInputProps } = useDropzone();

  const renderWidgetIcon = (status: UploadStatus) => {
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

  const renderStatusText = (status: UploadStatus) => {
    if (['success', 'error'].includes(status)) {
      return (
        <div className={styles[`uploadWidget__statusText--${status}`]}>
          {t(`bulkCodes:statusUploadCSV.${status}`)}
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

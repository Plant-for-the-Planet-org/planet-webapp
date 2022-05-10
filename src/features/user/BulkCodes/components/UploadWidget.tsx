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

  if (ready) {
    return (
      <div
        {...getRootProps({
          className: `${styles.dropzone} ${styles[`dropzone--${status}`]}`,
        })}
      >
        <input {...getInputProps()} />
        {renderWidgetIcon(status)}
        <p>{t(`bulkCodes:textUploadCSV.${status}`)}</p>
      </div>
    );
  }
  return null;
};

export default UploadWidget;

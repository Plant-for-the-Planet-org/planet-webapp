import React from 'react';
import DownloadIcon from '../../../../../../public/assets/images/icons/projectV2/DownloadIcon';
import styles from '../../styles/ProjectInfo.module.scss';

const DownloadsButton = ({ pdfUrl }: { pdfUrl: string }) => {
  return (
    <a
      className={styles.downloadIcon}
      href={pdfUrl}
      target="_blank"
      rel="noreferrer"
    >
      <DownloadIcon
        width={10}
        color={`${'rgba(var(--certification-background-color-new))'}`}
      />
    </a>
  );
};

export default DownloadsButton;

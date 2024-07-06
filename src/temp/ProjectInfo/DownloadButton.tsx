import React from 'react';
import DownloadIcon from '../icons/DownloadIcon';
import styles from './ProjectInfo.module.scss';

const DownloadsButton = () => {
  return (
    <button className={styles.downloadIcon}>
      <DownloadIcon
        width={10}
        color={`${'rgba(var(--certification-background-color-new))'}`}
      />
    </button>
  );
};

export default DownloadsButton;

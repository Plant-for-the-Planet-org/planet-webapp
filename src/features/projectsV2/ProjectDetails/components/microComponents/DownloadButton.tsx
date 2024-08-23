import React from 'react';
import DownloadIcon from '../../../../../temp/icons/DownloadIcon';
import styles from '../../styles/ProjectInfo.module.scss';

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

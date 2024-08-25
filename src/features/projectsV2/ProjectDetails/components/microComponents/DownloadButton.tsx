import React from 'react';
import DownloadIcon from '../../../../../temp/icons/DownloadIcon';
import styles from '../../styles/ProjectInfo.module.scss';

const DownloadsButton = ({ pdfUrl }) => {
  const handleDownload = (pdfUrl: string) => {
    console.log('Attempting to download:', pdfUrl); // Add this line

    try {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank'); // Add this line
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again or contact support.');
    }
  };
  return (
    <button
      className={styles.downloadIcon}
      onClick={() => handleDownload(pdfUrl)}
    >
      <DownloadIcon
        width={10}
        color={`${'rgba(var(--certification-background-color-new))'}`}
      />
    </button>
  );
};

export default DownloadsButton;

import React from 'react';
import styles from '../../features/projectsV2/ProjectDetails/styles/ProjectInfo.module.scss';
import DownloadsLabel from './DownloadsLabel';
import DownloadButton from './DownloadButton';

interface Props {
  certification: string;
}

const ExternalCertificationItems = ({ certification }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;

  return (
    <div className={styles.infoDetail}>
      {isMobile ? (
        <DownloadsLabel>
          <p>{certification}</p>
        </DownloadsLabel>
      ) : (
        <DownloadsLabel>
          <a href="#" target="_blank" rel="noreferrer">
            {certification}
          </a>
        </DownloadsLabel>
      )}
      <DownloadButton />
    </div>
  );
};

export default ExternalCertificationItems;

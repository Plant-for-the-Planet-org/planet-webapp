import React from 'react';
import styles from './ProjectInfo.module.scss';
import CertificationLabel from './CertificationLabel';
import { renderDownloadIcon } from './ExternalCertification';

interface Props {
  certification: string;
}

const ExternalCertificationItems = ({ certification }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;

  return (
    <div className={styles.infoDetail}>
      {isMobile ? (
        <CertificationLabel>
          <p>{certification}</p>
        </CertificationLabel>
      ) : (
        <CertificationLabel>
          <a href="#" target="_blank" rel="noreferrer">
            {certification}
          </a>
        </CertificationLabel>
      )}
      {renderDownloadIcon()}
    </div>
  );
};

export default ExternalCertificationItems;

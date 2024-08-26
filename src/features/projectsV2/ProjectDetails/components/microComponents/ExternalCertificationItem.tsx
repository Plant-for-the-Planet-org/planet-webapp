import React from 'react';
import styles from '../../styles/ProjectInfo.module.scss';
import DownloadsLabel from './DownloadsLabel';
import DownloadButton from './DownloadButton';
import { Certificate } from '@planet-sdk/common';
import { getPDFFile } from '../../../../../utils/getImageURL';

interface Props {
  certification: Certificate[];
}

const ExternalCertificationItems = ({ certification }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;

  return (
    <>
      {certification.map((certificate) => {
        <div className={styles.infoDetail}>
          {isMobile ? (
            <DownloadsLabel>
              <p>{certificate}</p>
            </DownloadsLabel>
          ) : (
            <DownloadsLabel>
              <a
                href={getPDFFile('projectCertificate', certificate.pdf)}
                target="_blank"
                rel="noreferrer"
              >
                {certificate}
              </a>
            </DownloadsLabel>
          )}
          <DownloadButton pdfUrl={certificate.pdf} />
        </div>;
      })}
    </>
  );
};

export default ExternalCertificationItems;

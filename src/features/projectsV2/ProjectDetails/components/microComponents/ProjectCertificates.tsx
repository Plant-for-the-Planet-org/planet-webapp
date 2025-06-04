import type { Certificate } from '@planet-sdk/common';

import React from 'react';
import styles from '../../styles/ProjectInfo.module.scss';
import DownloadsLabel from './DownloadsLabel';
import DownloadButton from './DownloadButton';
import { getPDFFile } from '../../../../../utils/getImageURL';

interface Props {
  certificates: Certificate[];
}

const ProjectCertificates = ({ certificates }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;

  return (
    <div className={styles.certificateDataContainer}>
      {certificates.map((certificate) => {
        const pdfUrl = getPDFFile('projectCertificate', certificate.pdf);
        return (
          <div key={certificate.pdf} className={styles.certificateItem}>
            {isMobile ? (
              <DownloadsLabel>
                <p>{certificate.certifierName}</p>
              </DownloadsLabel>
            ) : (
              <DownloadsLabel>
                <a href={pdfUrl} target="_blank" rel="noreferrer">
                  {certificate.certifierName}
                </a>
              </DownloadsLabel>
            )}
            <DownloadButton pdfUrl={pdfUrl} />
          </div>
        );
      })}
    </div>
  );
};

export default ProjectCertificates;

import React from 'react';
import { type Certificate } from '@planet-sdk/common';
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
    <>
      {certificates.map((certificate) => {
        <div className={styles.certificateDataContainer}>
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

export default ProjectCertificates;

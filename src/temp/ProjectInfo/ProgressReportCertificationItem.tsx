import React from 'react';
import styles from './ProjectInfo.module.scss';
import CertificationLabel from './CertificationLabel';
import { renderDownloadIcon } from './ExternalCertification';

interface Props {
  progressReports: number[];
}

const ProgressReportCertificationItem = ({ progressReports }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;
  return (
    <div className={styles.reportsContainer}>
      {progressReports.map((report) => (
        <div key={report}>
          {isMobile ? (
            <CertificationLabel>
              <p>{report.toString()} </p>
            </CertificationLabel>
          ) : (
            <CertificationLabel>
              <a href="#" target="_blank" rel="noreferrer">
                {report}
              </a>
            </CertificationLabel>
          )}
          {renderDownloadIcon()}
        </div>
      ))}
    </div>
  );
};

export default ProgressReportCertificationItem;

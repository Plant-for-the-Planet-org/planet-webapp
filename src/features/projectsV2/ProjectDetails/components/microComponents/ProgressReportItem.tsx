import React from 'react';
import styles from '../../styles/ProjectInfo.module.scss';
import DownloadsLabel from './DownloadsLabel';
import DownloadButton from './DownloadButton';

interface Props {
  progressReports: number[];
}

const ProgressReportItem = ({ progressReports }: Props) => {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 481;
  return (
    <div className={styles.reportsContainer}>
      {progressReports?.map((report) => (
        <div key={report}>
          {isMobile ? (
            <DownloadsLabel>
              <p>{report.toString()} </p>
            </DownloadsLabel>
          ) : (
            <DownloadsLabel>
              <a href="#" target="_blank" rel="noreferrer">
                {report}
              </a>
            </DownloadsLabel>
          )}
          <DownloadButton />
        </div>
      ))}
    </div>
  );
};

export default ProgressReportItem;

import styles from '../../styles/ProjectInfo.module.scss';
import DownloadsLabel from './DownloadsLabel';

interface Props {
  progressReports: number[];
}
// Not used right now: progress reports need backend support, so its only use in ProjectDownloads is commented out. Decide later whether to use it once the backend is ready or remove it.
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
          {/* <DownloadButton /> */}
        </div>
      ))}
    </div>
  );
};

export default ProgressReportItem;

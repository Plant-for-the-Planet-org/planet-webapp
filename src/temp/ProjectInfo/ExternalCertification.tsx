import { ProjectExpense } from '@planet-sdk/common';
import styles from './ProjectInfo.module.scss';
import getFormatedCurrency from '../../utils/countryCurrency/getFormattedCurrency';
import { useTranslation } from 'next-i18next';
import DownloadIcon from '../icons/DownloadIcon';

interface Props {
  certification: string;
  spendings: ProjectExpense[];
  progressReports: number[];
}

const ExternalCertification = ({
  certification,
  spendings,
  progressReports,
}: Props) => {
  const { i18n } = useTranslation(['manageProjects', 'common']);
  return (
    <div className={styles.certificationContainer}>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>external certification</div>
          <div className={styles.infoDetail}>
            <div className={styles.certificationLabel}>{certification}</div>
            <div className={styles.downloadIcon}>
              <DownloadIcon />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>project spending</div>
          <div className={styles.spendingsContainer}>
            {spendings.map((expense) => (
              <div className={styles.spendingDetail} key={expense.id}>
                <div className={styles.certificationLabel}>{expense.year}</div>
                <div>
                  {getFormatedCurrency(i18n.language, 'EUR', expense.amount)}
                </div>
                <div className={styles.downloadIcon}>
                  <DownloadIcon />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>progress reports</div>
          <div className={styles.reportsContainer}>
            {progressReports.map((report, index) => (
              <div key={index}>
                <div className={styles.certificationLabel}>{report}</div>
                <div className={styles.downloadIcon}>
                  <DownloadIcon />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalCertification;

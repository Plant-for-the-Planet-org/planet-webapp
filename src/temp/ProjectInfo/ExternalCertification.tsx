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
  const { t, i18n } = useTranslation(['manageProjects', 'projectDetails']);

  return (
    <div className={styles.certificationContainer}>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:externalCertifications')}
          </div>
          <div className={styles.infoDetail}>
            <div className={styles.certificationLabel}>{certification}</div>
            <div className={styles.downloadIcon}>
              <DownloadIcon width={10} color={'#6C63FF'} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('manageProjects:projectSpending')}
          </div>
          <div className={styles.spendingsContainer}>
            {spendings.map((expense) => (
              <div className={styles.spendingDetail} key={expense.id}>
                <time className={styles.certificationLabel}>
                  {expense.year}
                </time>
                <div>
                  {getFormatedCurrency(i18n.language, 'EUR', expense.amount)}
                </div>

                <div className={styles.downloadIcon}>
                  <DownloadIcon width={10} color={'#6C63FF'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.singleInfo}>
        <div className={styles.halfInfo}>
          <div className={styles.infoTitle}>
            {t('projectDetails:progressReports')}
          </div>
          <div className={styles.reportsContainer}>
            {progressReports.map((report, index) => (
              <div key={index}>
                <div className={styles.certificationLabel}>{report}</div>
                <div className={styles.downloadIcon}>
                  <DownloadIcon width={10} color={'#6C63FF'} />
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

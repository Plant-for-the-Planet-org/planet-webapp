import { ProjectExpense } from '@planet-sdk/common';
import styles from './ProjectInfo.module.scss';
import getFormatedCurrency from '../../utils/countryCurrency/getFormattedCurrency';
import { useTranslation } from 'next-i18next';
import DownloadIcon from '../icons/DownloadIcon';
import SingleProjectInfoItem from './SingleProjectInfoItem';

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

  const certificationContent = [
    {
      title: `${t('manageProjects:externalCertifications')}`,
      content: (
        <div className={styles.infoDetail}>
          <div className={styles.certificationLabel}>{certification}</div>
          <div className={styles.downloadIcon}>
            <DownloadIcon
              width={10}
              color={`${'rgba(var(--certification-background-color-new))'}`}
            />
          </div>
        </div>
      ),
    },
    {
      title: `${t('manageProjects:projectSpending')}`,
      content: (
        <div className={styles.spendingsContainer}>
          {spendings.map((expense) => (
            <div className={styles.spendingDetail} key={expense.id}>
              <time className={styles.certificationLabel}>{expense.year}</time>
              <div>
                {getFormatedCurrency(i18n.language, 'EUR', expense.amount)}
              </div>

              <div className={styles.downloadIcon}>
                <DownloadIcon
                  width={10}
                  color={`${'rgba(var(--certification-background-color-new))'}`}
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: `${t('projectDetails:progressReports')}`,
      content: (
        <div className={styles.reportsContainer}>
          {progressReports.map((report, index) => (
            <div key={index}>
              <div className={styles.certificationLabel}>{report}</div>
              <div className={styles.downloadIcon}>
                <DownloadIcon
                  width={10}
                  color={`${'rgba(var(--certification-background-color-new))'}`}
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.certificationContainer}>
      {certificationContent.map((item) => (
        <SingleProjectInfoItem
          key={item.title}
          title={item.title}
          itemContent={item.content}
        />
      ))}
    </div>
  );
};

export default ExternalCertification;

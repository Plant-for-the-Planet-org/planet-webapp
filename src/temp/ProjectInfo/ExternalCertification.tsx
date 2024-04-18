import { ProjectExpense } from '@planet-sdk/common';
import styles from './ProjectInfo.module.scss';
import { useTranslation } from 'next-i18next';
import DownloadIcon from '../icons/DownloadIcon';
import SingleProjectInfoItem from './SingleProjectInfoItem';
import ExternalCertificationItem from './ExternalCertificationItem';
import ProjectSpendingCertificationItem from './ProjectSpendingCertificationItem';
import ProgressReportCertificationItem from './ProgressReportCertificationItem';

export const renderDownloadIcon = () => {
  return (
    <div className={styles.downloadIcon}>
      <DownloadIcon
        width={10}
        color={`${'rgba(var(--certification-background-color-new))'}`}
      />
    </div>
  );
};

interface ExternalCertificationProps {
  certification: string;
  spendings: ProjectExpense[];
  progressReports: number[];
}

const ExternalCertification = ({
  certification,
  spendings,
  progressReports,
}: ExternalCertificationProps) => {
  const { t } = useTranslation(['manageProjects', 'projectDetails']);

  const certificationContent = [
    {
      title: `${t('manageProjects:externalCertifications')}`,
      content: <ExternalCertificationItem certification={certification} />,
    },
    {
      title: `${t('manageProjects:projectSpending')}`,
      content: <ProjectSpendingCertificationItem spendings={spendings} />,
    },
    {
      title: `${t('projectDetails:progressReports')}`,
      content: (
        <ProgressReportCertificationItem progressReports={progressReports} />
      ),
    },
  ];

  return (
    <div className={styles.certificationContainer}>
      {certificationContent.map((item) => (
        <SingleProjectInfoItem key={item.title} title={item.title}>
          {item.content}
        </SingleProjectInfoItem>
      ))}
    </div>
  );
};

export default ExternalCertification;

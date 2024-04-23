import { ProjectExpense } from '@planet-sdk/common';
import styles from './ProjectInfo.module.scss';
import { useTranslation } from 'next-i18next';
import DownloadIcon from '../icons/DownloadIcon';
import SingleProjectInfoItem from './SingleProjectInfoItem';
import ExternalCertificationItem from './ExternalCertificationItem';
import ProjectSpendingItem from './ProjectSpendingItem';
import ProgressReportItem from './ProgressReportItem';

interface ExternalCertificationProps {
  certification: string;
  spendings: ProjectExpense[];
  progressReports: number[];
}

const ProjectDownloads = ({
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
      content: <ProjectSpendingItem spendings={spendings} />,
    },
    {
      title: `${t('projectDetails:progressReports')}`,
      content: <ProgressReportItem progressReports={progressReports} />,
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

export default ProjectDownloads;

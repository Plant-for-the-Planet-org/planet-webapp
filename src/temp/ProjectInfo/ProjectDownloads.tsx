import { ProjectExpense } from '@planet-sdk/common';
import styles from './ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';
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
  const tManageProjects = useTranslations('ManageProjects');
  const tProjectDetails = useTranslations('ProjectDetails');

  const certificationContent = [
    {
      title: `${tManageProjects('externalCertifications')}`,
      content: <ExternalCertificationItem certification={certification} />,
    },
    {
      title: `${tManageProjects('projectSpending')}`,
      content: <ProjectSpendingItem spendings={spendings} />,
    },
    {
      title: `${tProjectDetails('progressReports')}`,
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

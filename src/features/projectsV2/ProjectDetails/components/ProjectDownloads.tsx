import { Certificate, ProjectExpense } from '@planet-sdk/common';
import styles from '../styles/ProjectInfo.module.scss';
import { useTranslations } from 'next-intl';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
import ExternalCertificationItem from './microComponents/ExternalCertificationItem';
import ProjectSpendingItem from './microComponents/ProjectSpendingItem';

interface ExternalCertificationProps {
  certification: Certificate[];
  spendings: ProjectExpense[];
}

const ProjectDownloads = ({
  certification,
  spendings,
}: ExternalCertificationProps) => {
  const tManageProjects = useTranslations('ManageProjects');

  const certificationContent = [
    {
      title: `${tManageProjects('externalCertifications')}`,
      content: <ExternalCertificationItem certification={certification} />,
      shouldRender: certification.length > 0,
    },
    {
      title: `${tManageProjects('projectSpending')}`,
      content: <ProjectSpendingItem spendings={spendings} />,
      shouldRender: spendings.length > 0,
    },
    //TODO: Backend implementation pending for progressReport
    // {
    //   title: `${tProjectDetails('progressReports')}`,
    //   content: <ProgressReportItem progressReports={progressReports} />,
    // },
  ];

  return (
    <div className={styles.certificationContainer}>
      {certificationContent
        .filter((item) => item.shouldRender)
        .map((item) => (
          <SingleProjectInfoItem key={item.title} title={item.title}>
            {item.content}
          </SingleProjectInfoItem>
        ))}
    </div>
  );
};

export default ProjectDownloads;

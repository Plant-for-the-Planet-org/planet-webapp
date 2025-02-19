import type { Certificate, ProjectExpense } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectInfo.module.scss';
import SingleProjectInfoItem from './microComponents/SingleProjectInfoItem';
import ProjectCertificates from './microComponents/ProjectCertificates';
import ProjectExpenseReports from './microComponents/ProjectExpenseReports';

interface Props {
  certificates: Certificate[];
  expenses: ProjectExpense[];
}

const ProjectDownloads = ({ certificates, expenses }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  const downloadsRenderConfig = [
    {
      title: `${tProjectDetails('externalCertifications')}`,
      content: <ProjectCertificates certificates={certificates} />,
      shouldRender: certificates.length > 0,
    },
    {
      title: `${tProjectDetails('projectSpending')}`,
      content: <ProjectExpenseReports expenses={expenses} />,
      shouldRender: expenses.length > 0,
    },
    //TODO: Backend implementation pending for progressReport
    // {
    //   title: `${tProjectDetails('progressReports')}`,
    //   content: <ProgressReportItem progressReports={progressReports} />,
    // },
  ];

  return (
    <div className={styles.projectSummary}>
      {downloadsRenderConfig
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

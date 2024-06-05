import styles from './MyContributions.module.scss';
import ProjectTypeIcon from '../../../projects/components/ProjectTypeIcon';
import { useTranslations } from 'next-intl';
import { EcosystemTypes, TreeProjectClassification } from '@planet-sdk/common';

type ConservationProps = {
  projectPurpose: 'conservation';
  projectEcosystem: Exclude<EcosystemTypes, 'tropical-forests' | 'temperate'>;
};

type TreesProps = {
  projectPurpose: 'trees';
  projectClassification: TreeProjectClassification;
};

type Props = (ConservationProps | TreesProps) & {
  projectName: string;
  color?: 'light' | 'dark';
};

const ProjectHeader = ({ color = 'dark', ...otherProps }: Props) => {
  const tProject = useTranslations('Project');
  const { projectName, projectPurpose } = otherProps;

  const projectType =
    projectPurpose === 'trees'
      ? otherProps.projectClassification
      : otherProps.projectPurpose;

  return (
    <header className={`${styles.projectHeader} ${styles[color]}`}>
      <div className={styles.projectType}>
        <div className={styles.projectTypeIcon}>
          <ProjectTypeIcon projectType={projectType} />
        </div>
        <div className={styles.projectCategory}>
          {projectPurpose === 'trees'
            ? tProject(
                `classification.${otherProps.projectClassification}`
              ).toLocaleUpperCase()
            : tProject(
                `ecosystem.${otherProps.projectEcosystem}`
              ).toLocaleUpperCase()}
        </div>
      </div>
      <h3 className={styles.projectName}>{projectName}</h3>
    </header>
  );
};

export default ProjectHeader;

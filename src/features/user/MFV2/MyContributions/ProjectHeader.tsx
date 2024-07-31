import styles from './MyContributions.module.scss';
import ProjectTypeIcon from '../../../projectsV2/components/microComponents/ProjectTypeIcon';
import { useTranslations } from 'next-intl';
import { EcosystemTypes, TreeProjectClassification } from '@planet-sdk/common';
import { useMemo } from 'react';

type ConservationProps = {
  projectPurpose: 'conservation';
  projectEcosystem: Exclude<
    EcosystemTypes,
    'tropical-forests' | 'temperate'
  > | null;
};

type TreesProps = {
  projectPurpose: 'trees';
  projectClassification: TreeProjectClassification | null;
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

  const projectCategory = useMemo(() => {
    if (
      projectPurpose === 'trees' &&
      otherProps.projectClassification !== null
    ) {
      return tProject(
        `classification.${otherProps.projectClassification}`
      ).toLocaleUpperCase();
    }

    if (
      projectPurpose === 'conservation' &&
      otherProps.projectEcosystem !== null
    ) {
      return tProject(
        `ecosystem.${otherProps.projectEcosystem}`
      ).toLocaleUpperCase();
    }

    return null;
  }, [tProject, projectType, otherProps]);

  return (
    <header className={`${styles.projectHeader} ${styles[color]}`}>
      {projectType !== null && projectCategory !== null && (
        <div className={styles.projectType}>
          <div className={styles.projectTypeIcon}>
            <ProjectTypeIcon projectType={projectType} />
          </div>
          <div className={styles.projectCategory}>{projectCategory}</div>
        </div>
      )}
      <h3 className={styles.projectName}>{projectName}</h3>
    </header>
  );
};

export default ProjectHeader;

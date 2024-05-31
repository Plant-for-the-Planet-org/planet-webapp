import { useTranslations } from 'next-intl';
import styles from './MyContributions.module.scss';
import {
  CountryCode,
  EcosystemTypes,
  TreeProjectClassification,
} from '@planet-sdk/common';
import ProjectTypeIcon from '../../../projects/components/ProjectTypeIcon';

type ConservationProps = {
  projectPurpose: 'conservation';
  projectEcosystem: Exclude<EcosystemTypes, 'tropical-forests' | 'temperate'>;
};

type TreesProps = {
  projectPurpose: 'trees';
  classification: TreeProjectClassification;
};

type Props = (ConservationProps | TreesProps) & {
  projectName: string;
  projectCountry: CountryCode;
  projectTpoName: string;
};

const ProjectSummary = (props: Props) => {
  const tProject = useTranslations('Project');
  const tCountry = useTranslations('Country');

  const { projectName, projectCountry, projectTpoName, projectPurpose } = props;

  const projectType =
    projectPurpose === 'trees' ? props.classification : props.projectPurpose;

  return (
    <div className={styles.projectSummary}>
      <div className={styles.projectType}>
        <div className={styles.projectTypeIcon}>
          <ProjectTypeIcon projectType={projectType} />
        </div>
        <div className={styles.projectCategory}>
          {projectPurpose === 'trees'
            ? tProject(
                `classification.${props.classification}`
              ).toLocaleUpperCase()
            : tProject(
                `ecosystem.${props.projectEcosystem}`
              ).toLocaleUpperCase()}
        </div>
      </div>
      <h3 className={styles.projectName}>{projectName}</h3>
      <div className={styles.additionalProjectInfo}>
        {tCountry(projectCountry.toLowerCase() as Lowercase<CountryCode>)} •{' '}
        {tProject('tpoName', { tpoName: projectTpoName })}
      </div>
    </div>
  );
};

export default ProjectSummary;

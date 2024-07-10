import { useTranslations } from 'next-intl';
import styles from './MyContributions.module.scss';
import {
  CountryCode,
  EcosystemTypes,
  TreeProjectClassification,
} from '@planet-sdk/common';
import ProjectHeader from './ProjectHeader';

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
  projectCountry: CountryCode;
  projectTpoName: string;
};

const ProjectSummary = (props: Props) => {
  const tProject = useTranslations('Project');
  const tCountry = useTranslations('Country');

  const { projectCountry, projectTpoName, projectName, projectPurpose } = props;

  const projectHeaderProps =
    projectPurpose === 'trees'
      ? {
          projectName,
          projectPurpose: 'trees' as const,
          projectClassification: props.projectClassification,
        }
      : {
          projectName,
          projectPurpose: 'conservation' as const,
          projectEcosystem: props.projectEcosystem,
        };

  return (
    <div className={styles.projectSummary}>
      <ProjectHeader {...projectHeaderProps} />
      <div className={styles.additionalProjectInfo}>
        {tCountry(projectCountry.toLowerCase() as Lowercase<CountryCode>)} •{' '}
        {tProject('tpoName', { tpoName: projectTpoName })}
      </div>
    </div>
  );
};

export default ProjectSummary;

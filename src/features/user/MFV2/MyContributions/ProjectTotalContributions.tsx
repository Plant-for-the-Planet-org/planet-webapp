import { useTranslations } from 'next-intl';
import styles from './MyContributions.module.scss';

type TotalContributionsConservation = {
  projectPurpose: 'conservation';
  totalContributionUnits: number;
  contributionUnitType: 'm2';
};

type TotalContributionsTrees = {
  projectPurpose: 'trees';
  totalContributionUnits: number;
  contributionUnitType: 'tree' | 'm2';
};

type Props = TotalContributionsConservation | TotalContributionsTrees;

const ProjectTotalContributions = ({
  projectPurpose,
  totalContributionUnits,
  contributionUnitType,
}: Props) => {
  const t = useTranslations('Profile');

  const totalContributedUnits =
    contributionUnitType === 'tree'
      ? t('myContributions.treesContributed', {
          count: totalContributionUnits,
        })
      : t('myContributions.areaContributed', {
          count: totalContributionUnits,
          projectPurpose: projectPurpose,
        });

  return (
    <div className={styles.projectTotalContributions}>
      {totalContributedUnits}
    </div>
  );
};

export default ProjectTotalContributions;

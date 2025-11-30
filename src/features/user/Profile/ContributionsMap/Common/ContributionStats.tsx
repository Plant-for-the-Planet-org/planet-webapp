import type { ReactElement } from 'react';

import { useMemo } from 'react';
import {
  ProjectStatIcon,
  CountryStatIcon,
} from '../../../../../../public/assets/images/icons/myForestMapIcons';
import styles from './common.module.scss';
import { useTranslations } from 'next-intl';
import { useMyForestStore } from '../../../../../stores/myForestStore';

interface StatItemProps {
  icon: ReactElement;
  label: string;
}

const StatItem = ({ icon, label }: StatItemProps) => {
  return (
    <div className={styles.contributionStatsSubContainer}>
      <div className={styles.statsIconContainer}>{icon}</div>
      <div className={styles.stats}>{label}</div>
    </div>
  );
};

const ContributionStats = () => {
  const tProfile = useTranslations('Profile.mapStats');
  const contributionsResult = useMyForestStore(
    (state) => state.contributionsResult
  );
  const projectListResult = useMyForestStore(
    (state) => state.projectListResult
  );
  const { countries, projects } = useMemo(
    function calculationContributionStats() {
      const myContributionsMap = contributionsResult?.myContributionsMap;
      const projectList = projectListResult;

      if (!myContributionsMap || !projectList) {
        return { countries: 0, projects: 0 };
      }

      const contributedProjects = new Set<string>();
      const contributedCountries = new Set<string>();

      // Iterate through contributions Map
      for (const [projectId, contributionData] of myContributionsMap) {
        // Count all project contributions while identifying unique countries and projects
        if (contributionData.type === 'project') {
          contributedProjects.add(projectId);

          // Get country from projectListResult
          const project = projectList[projectId];
          if (project?.country) {
            contributedCountries.add(project.country);
          }
        }
      }

      return {
        countries: contributedCountries.size,
        projects: contributedProjects.size,
      };
    },
    [contributionsResult?.myContributionsMap, projectListResult]
  );

  return (
    <div className={styles.contributionStatsContainer}>
      <StatItem
        icon={<CountryStatIcon />}
        label={tProfile('countryStats', {
          count: countries,
        })}
      />
      <StatItem
        icon={<ProjectStatIcon />}
        label={tProfile('projectStats', {
          count: projects,
        })}
      />
    </div>
  );
};

export default ContributionStats;

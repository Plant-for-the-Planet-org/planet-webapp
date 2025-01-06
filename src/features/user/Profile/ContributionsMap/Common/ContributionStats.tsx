import type { JSX } from 'react';

import {
  ProjectStatIcon,
  CountryStatIcon,
} from '../../../../../../public/assets/images/icons/myForestMapIcons';
import style from './common.module.scss';
import { useTranslations } from 'next-intl';
import { useMyForest } from '../../../../common/Layout/MyForestContext';

interface StatItemProps {
  icon: JSX.Element;
  label: string;
}

const StatItem = ({ icon, label }: StatItemProps) => {
  return (
    <div className={style.contributionStatsSubContainer}>
      <div className={style.statsIconContainer}>{icon}</div>

      <div className={style.stats}>{label}</div>
    </div>
  );
};

const ContributionStats = () => {
  const tProfile = useTranslations('Profile.mapStats');
  const { contributionsResult } = useMyForest();
  const countries = contributionsResult?.stats.contributedCountries.size;
  const projects = contributionsResult?.stats.contributedProjects.size;

  return (
    <div className={style.contributionStatsContainer}>
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

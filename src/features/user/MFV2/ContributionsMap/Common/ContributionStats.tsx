import {
  ProjectStatIcon,
  CountryStatIcon,
} from '../../../../../../public/assets/images/icons/myForestMapIcons';
import style from '../Common/common.module.scss';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';

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
  const { contributionsResult } = useMyForestV2();
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

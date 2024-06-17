import {
  DonationStatIcon,
  CountryStatIcon,
} from '../../../../../../public/assets/images/icons/MyForestMapIcons';
import style from '../Common/common.module.scss';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';

interface StatItemProps {
  projectStatIcon: React.ElementType;
  label: string;
}

const StatItem = ({
  projectStatIcon: ProjectStatIcon,
  label,
}: StatItemProps) => {
  return (
    <div className={style.contributionStatsSubContainer}>
      <div className={style.statsIconContainer}>
        <ProjectStatIcon />
      </div>

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
        projectStatIcon={CountryStatIcon}
        label={tProfile('countryStats', {
          count: countries,
        })}
      />
      <StatItem
        projectStatIcon={DonationStatIcon}
        label={tProfile('projectStats', {
          count: projects,
        })}
      />
    </div>
  );
};

export default ContributionStats;

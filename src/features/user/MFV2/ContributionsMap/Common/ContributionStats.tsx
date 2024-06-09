import {
  DonationStatIcon,
  CountryStatIcon,
} from '../../../../../../public/assets/images/icons/MyForestMapIcons';
import style from '../Common/common.module.scss';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../../common/Layout/MyForestContextV2';

interface StatItemProps {
  Icon: React.ElementType;
  label: string;
}

const StatItem = ({ Icon, label }: StatItemProps) => {
  return (
    <div className={style.contributionStatsSubContainer}>
      <div className={style.statsIconContainer}>
        <Icon />
      </div>

      <div className={style.stats}>{label}</div>
    </div>
  );
};

const ContributionStats = () => {
  const tProfile = useTranslations('Profile');
  const { contributionsResult } = useMyForestV2();
  const countries = contributionsResult?.stats.contributedCountries.size ?? 0;
  const projects = contributionsResult?.stats.contributedProjects.size ?? 0;

  return (
    <div className={style.contributionStatsContainer}>
      <StatItem
        Icon={CountryStatIcon}
        label={tProfile('mapState.countryStats', {
          count: countries,
        })}
      />
      <StatItem
        Icon={DonationStatIcon}
        label={tProfile('mapState.projectStats', {
          count: projects,
        })}
      />
    </div>
  );
};

export default ContributionStats;

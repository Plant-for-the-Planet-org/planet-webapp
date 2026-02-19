import type { JSX } from 'react';
import type { TenantStatsData } from '..';

import {
  CountriesIcon,
  DonorsIcon,
  HectaresRestoredIcon,
  TotalDonatedIcon,
  TreesPlantedIcon,
} from '../../../../../public/assets/images/icons/tenantDashboard';
import styles from '../TenantDashboard.module.scss';
import StatCard from './microComponents/StatCard';
import { useLocale, useTranslations } from 'next-intl';
import { formatStatNumber } from '../utils';

export interface StatItem {
  icon: JSX.Element;
  value: string | number;
  label: string;
}
interface TenantStatsProp {
  tenantStats: TenantStatsData | null;
}

const TenantStats = ({ tenantStats }: TenantStatsProp) => {
  const t = useTranslations('Profile.tenant');
  const locale = useLocale();

  if (!tenantStats) return null;
  const { totalPlanted, totalRestored, totalDonated, uniqueDonors, countries } =
    tenantStats.global;

  const statConfig: StatItem[] = [
    {
      icon: <TreesPlantedIcon />,
      value: formatStatNumber(totalPlanted, locale),
      label: t('treesPlanted'),
    },
    {
      icon: <HectaresRestoredIcon />,
      value: formatStatNumber(totalRestored, locale),
      label: t('hectaresRestored'),
    },
    {
      icon: <TotalDonatedIcon />,
      value: formatStatNumber(totalDonated, locale),
      label: t('totalDonated'),
    },
    {
      icon: <DonorsIcon />,
      value: uniqueDonors,
      label: t('donors'),
    },
    {
      icon: <CountriesIcon />,
      value: countries,
      label: t('countries'),
    },
  ];
  return (
    <section className={styles.tenantStatsContainer}>
      {statConfig.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
};

export default TenantStats;

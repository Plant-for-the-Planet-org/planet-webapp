import type { JSX } from 'react';
import type { APIError, CountryCode } from '@planet-sdk/common';

import { useEffect, useState } from 'react';
import {
  CountriesIcon,
  DonorsIcon,
  HectaresRestoredIcon,
  TotalDonatedIcon,
  TreesPlantedIcon,
} from '../../../../../public/assets/images/icons/tenantDashboard';
import style from '../TenantDashboard.module.scss';
import StatCard from './microComponents/StatCard';
import { useApi } from '../../../../hooks/useApi';
import { handleError } from '@planet-sdk/common';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';
import { defaultTenant } from '../../../../../tenant.config';
import { useLocale, useTranslations } from 'next-intl';
import { formatStatNumber } from '../utils';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';

export interface StatItem {
  icon: JSX.Element;
  value: string | number;
  label: string;
}

export interface TenantStats {
  global: Global;
  countries: Country[];
}

export interface Global {
  tenant: string;
  totalDonated: number;
  totalPlanted: number;
  totalRestored: number;
  countries: number;
  uniqueDonors: number;
  currency: string;
}

export interface Country {
  country: CountryCode;
  trees: number;
}

const TenantStats = () => {
  const [tenantStats, setTenantStats] = useState<TenantStats | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const t = useTranslations('Profile.tenant');
  const { getApi } = useApi();
  const locale = useLocale();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();

  const fetchTenantStats = async () => {
    setIsFetching(true);
    try {
      const stats = await getApi<TenantStats>(
        `/app/tenantDashboard/${defaultTenant.id}/stats`
      );
      setTenantStats(stats);
    } catch (error) {
      setErrors(handleError(error as APIError));
      router.push(localizedPath('/profile'));
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTenantStats();
  }, []);

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
    <section className={style.tenantStatsContainer}>
      {statConfig.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
};

export default TenantStats;

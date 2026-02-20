import type { CountryLeaderboardInterface } from '..';

import { useTranslations } from 'next-intl';
import { TreesPlantedIcon } from '../../../../../public/assets/images/icons/tenantDashboard';
import styles from '../TenantDashboard.module.scss';
import LeaderboardRow from './microComponents/LeaderboardRow';
import WebappButton from '../../../common/WebappButton';
import { useState } from 'react';
import { clsx } from 'clsx';

const LEADERBOARD_PREVIEW_COUNT = 10;
interface CountryLeaderboard {
  countries: CountryLeaderboardInterface[] | null;
  totalTreesPlanted: number | undefined;
}

const CountryLeaderboard = ({
  countries,
  totalTreesPlanted,
}: CountryLeaderboard) => {
  const t = useTranslations('Profile.tenant');
  const [showAllCountry, setShowAllCountry] = useState(false);

  if (!countries || totalTreesPlanted === undefined) return null;

  const displayedCountries = showAllCountry
    ? countries
    : countries.slice(0, LEADERBOARD_PREVIEW_COUNT);

  return (
    <section className={clsx(styles.card, styles.leaderboard)}>
      <div className={styles.cardHeader}>
        <TreesPlantedIcon />
        <h2 className={styles.cardTitle}>{t('countryLeaderboard')}</h2>
      </div>

      <ol className={styles.leaderboardList}>
        {displayedCountries.map((row) => (
          <LeaderboardRow
            key={row.donor_country}
            countryCode={row.donor_country}
            treesPlanted={row.trees}
            totalTreePlanted={totalTreesPlanted}
          />
        ))}
      </ol>

      {countries.length > LEADERBOARD_PREVIEW_COUNT && (
        <div className={styles.leaderboardButton}>
          <WebappButton
            elementType="button"
            onClick={() => setShowAllCountry(!showAllCountry)}
            text={showAllCountry ? t('showLess') : t('showAll')}
            variant="primary"
          />
        </div>
      )}
    </section>
  );
};

export default CountryLeaderboard;

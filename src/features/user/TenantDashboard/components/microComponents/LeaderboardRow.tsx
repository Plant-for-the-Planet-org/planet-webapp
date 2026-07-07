import type { CountryCode } from '@planet-sdk/common';

import styles from '../../TenantDashboard.module.scss';
import { useTranslations } from 'next-intl';
import { countryToFlag } from '../../../../../utils/countryCurrency/countryToFlag';

interface LeaderboardRow {
  countryCode: CountryCode;
  treesPlanted: string;
  totalTreePlanted: number;
}

const LeaderboardRow = ({
  countryCode,
  treesPlanted,
  totalTreePlanted,
}: LeaderboardRow) => {
  const tCountry = useTranslations('Country');
  const t = useTranslations('Profile.tenant');
  const percentage =
    totalTreePlanted > 0
      ? Math.min(100, ((Number(treesPlanted) || 0) / totalTreePlanted) * 100)
      : 0;
  const roundedPercentage = Math.round(percentage);
  const flagEmoji = countryToFlag(countryCode);
  const countryName = tCountry(
    countryCode.toLowerCase() as Lowercase<CountryCode>
  );

  return (
    <li className={styles.leaderboardRow}>
      <div className={styles.leaderboardRowHeader}>
        <div className={styles.leaderboardCountry}>
          <span className={styles.leaderboardFlag} aria-hidden="true">
            {flagEmoji}
          </span>
          <span className={styles.leaderboardCountryName}>{countryName}</span>
        </div>
        <span className={styles.leaderboardTreeCount}>
          {t('treePlantedCount', { count: treesPlanted })}
        </span>
      </div>

      <div
        className={styles.progressBarTrack}
        role="progressbar"
        aria-valuenow={roundedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('leaderboardShare', { country: countryName })}
      >
        <div
          className={styles.progressBarFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </li>
  );
};

export default LeaderboardRow;

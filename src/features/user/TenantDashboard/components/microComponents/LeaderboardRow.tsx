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
    totalTreePlanted > 0 ? (Number(treesPlanted) / totalTreePlanted) * 100 : 0;
  const flagEmoji = countryToFlag(countryCode);

  return (
    <li className={styles.leaderboardRow}>
      <div className={styles.leaderboardRowHeader}>
        <div className={styles.leaderboardCountry}>
          <span className={styles.leaderboardFlag}>{flagEmoji}</span>
          <span className={styles.leaderboardCountryName}>
            {tCountry(countryCode.toLowerCase() as Lowercase<CountryCode>)}
          </span>
        </div>
        <span className={styles.leaderboardTreeCount}>
          {t('treePlantedCount', { count: treesPlanted })}
        </span>
      </div>

      <div className={styles.progressBarTrack}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </li>
  );
};

export default LeaderboardRow;

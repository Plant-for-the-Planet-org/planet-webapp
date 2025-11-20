import styles from './CountryLeaderboard.module.scss';
import commonStyles from '../../common.module.scss';
import WebappButton from '../../../../../features/common/WebappButton';

interface CountryData {
  rank: number;
  country: string;
  flag: string;
  treeCount: number;
}

const CountryLeaderboard = () => {
  // TODO - fetch real data from APIs once ready
  // TODO - paginate results. API may provide all data at once, show 10 at a time with pagination controls
  const countryData: CountryData[] = [
    { rank: 1, country: 'India', flag: '🇮🇳', treeCount: 1044968 },
    { rank: 2, country: 'Indonesia', flag: '🇮🇩', treeCount: 76688 },
    { rank: 3, country: 'United States', flag: '🇺🇸', treeCount: 70564 },
    { rank: 4, country: 'Germany', flag: '🇩🇪', treeCount: 68846 },
    { rank: 5, country: 'Brazil', flag: '🇧🇷', treeCount: 67486 },
    { rank: 6, country: 'Malaysia', flag: '🇲🇾', treeCount: 65068 },
    { rank: 7, country: 'Singapore', flag: '🇸🇬', treeCount: 61862 },
    { rank: 8, country: 'Philippines', flag: '🇵🇭', treeCount: 60540 },
    { rank: 9, country: 'Australia', flag: '🇦🇺', treeCount: 57854 },
    { rank: 10, country: 'South Africa', flag: '🇿🇦', treeCount: 56250 },
  ];

  const formatTreeCount = (treeCount: number): string => {
    return treeCount.toLocaleString();
  };

  return (
    <section className={styles.countryLeaderboard}>
      <div className={styles.earthBackground}>
        <img src="/tenants/concentrix/images/half-earth-background.png" />
      </div>

      <div className={styles.contentContainer}>
        <h2 className={`${commonStyles.heading3} ${styles.title}`}>
          2026 contributions by countries
        </h2>

        <div className={styles.leaderboardTable}>
          <div className={styles.tableHeader}>
            <span className={styles.rankHeader}>Rank</span>
            <span className={styles.countryHeader}>Countries</span>
            <span className={styles.amountHeader}>Trees</span>
          </div>

          <div className={styles.tableBody}>
            {countryData.map((country) => (
              <div key={country.rank} className={styles.tableRow}>
                <div className={styles.rankCell}>
                  <span className={styles.rankNumber}>{country.rank}</span>
                </div>
                <div className={styles.countryCell}>
                  <span className={styles.flag}>{country.flag}</span>
                  <span className={styles.countryName}>{country.country}</span>
                </div>
                <div className={styles.treeCountCell}>
                  <span className={styles.treeCount}>
                    {formatTreeCount(country.treeCount)}
                  </span>
                </div>
              </div>
            ))}

            {/* Pagination controls to be implemented */}
            <div className={styles.pagination}>
              <WebappButton
                elementType="button"
                variant="primary"
                text="Previous 10"
                buttonClasses={`${commonStyles.buttonStyles}`}
                onClick={() => window.alert('Pagination to be implemented')}
              />
              <WebappButton
                elementType="button"
                variant="primary"
                text="Next 10"
                buttonClasses={`${commonStyles.buttonStyles}`}
                onClick={() => window.alert('Pagination to be implemented')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountryLeaderboard;

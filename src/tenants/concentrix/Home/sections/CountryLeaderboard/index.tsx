import type { CountryCode } from '@planet-sdk/common';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { countryToFlag } from '../../../../../utils/countryCurrency/countryToFlag';
import WebappButton from '../../../../../features/common/WebappButton';
import styles from './CountryLeaderboard.module.scss';
import commonStyles from '../../common.module.scss';

export type CountryTreeDataItem = {
  country: CountryCode;
  treeCount: number;
};

interface CountryData {
  rank: number;
  countryName: string;
  flag: string;
  treeCountFormatted: string;
}

interface Props {
  countryWiseTrees: CountryTreeDataItem[];
  isDataLoaded: boolean;
}

const ITEMS_PER_PAGE = 10;

const CountryLeaderboard = ({ countryWiseTrees, isDataLoaded }: Props) => {
  const tCountry = useTranslations('Country');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [countryWiseTrees]);

  const formattedCountryData: CountryData[] = useMemo(
    () =>
      countryWiseTrees.map((item, index) => ({
        rank: index + 1,
        countryName: tCountry(
          item.country.toLowerCase() as Lowercase<CountryCode>
        ),
        flag: countryToFlag(item.country),
        treeCountFormatted: item.treeCount.toLocaleString(),
      })),
    [countryWiseTrees, tCountry]
  );

  const totalItems = formattedCountryData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = formattedCountryData.slice(startIndex, endIndex);

  const hasPrevious = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;

  // Logic to calculate the displayed result range
  const displayStart = startIndex + 1;
  const displayEnd = Math.min(endIndex, totalItems);
  const rangeText =
    displayStart === displayEnd
      ? `${displayStart} of ${totalItems}`
      : `${displayStart}-${displayEnd} of ${totalItems}`;

  const showPreviousPage = () => {
    if (hasPrevious) {
      setCurrentPage(currentPage - 1);
    }
  };

  const showNextPage = () => {
    if (hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className={styles.countryLeaderboard}>
      <div className={styles.contentContainer}>
        <h2 className={`${commonStyles.heading3} ${styles.title}`}>
          Contributions by Country
        </h2>
        {!isDataLoaded ? (
          <div key="loading" className={styles.loading}>
            Loading...
          </div>
        ) : (
          <div className={styles.leaderboardTable}>
            <div className={styles.tableHeader}>
              <span className={styles.rankHeader}>Rank</span>
              <span className={styles.countryHeader}>Countries</span>
              <span className={styles.amountHeader}>Trees</span>
            </div>

            {formattedCountryData.length === 0 ? (
              <div key="empty" className={styles.emptyData}>
                No data available
              </div>
            ) : (
              <div key="stats" className={styles.tableBody}>
                {currentPageData.map((item) => (
                  <div key={item.rank} className={styles.tableRow}>
                    <div className={styles.rankCell}>
                      <span className={styles.rankNumber}>{item.rank}</span>
                    </div>
                    <div className={styles.countryCell}>
                      <span className={styles.flag}>{item.flag}</span>
                      <span className={styles.countryName}>
                        {item.countryName}
                      </span>
                    </div>
                    <div className={styles.treeCountCell}>
                      <span className={styles.treeCount}>
                        {item.treeCountFormatted}
                      </span>
                    </div>
                  </div>
                ))}

                <div className={styles.pagination}>
                  <WebappButton
                    elementType="button"
                    variant="primary"
                    text="< Previous 10"
                    buttonClasses={`${commonStyles.buttonStyles} ${styles.buttonStyles}`}
                    onClick={showPreviousPage}
                    disabled={!hasPrevious}
                  />
                  <span className={styles.pageIndicator}>{rangeText}</span>
                  <WebappButton
                    elementType="button"
                    variant="primary"
                    text="Next 10 >"
                    buttonClasses={`${commonStyles.buttonStyles} ${styles.buttonStyles}`}
                    onClick={showNextPage}
                    disabled={!hasNext}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CountryLeaderboard;

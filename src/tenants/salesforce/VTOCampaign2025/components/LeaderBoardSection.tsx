import { useState } from 'react';
import styles from './../styles/LeaderBoardSection.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';

interface Props {
  leaderboard: {
    mostDonated: { created: string; donorName: string; treeCount: string }[];
    mostRecent: { created: string; donorName: string; treeCount: string }[];
  };
  isLoaded: boolean;
}

export default function LeaderBoardSection({ leaderboard, isLoaded }: Props) {
  const [selectedTab, setSelectedTab] = useState('recent');
  const isLeaderboardAvailable =
    isLoaded &&
    leaderboard &&
    leaderboard.mostDonated.length + leaderboard.mostRecent.length > 0 &&
    !(
      leaderboard.mostDonated.length === 1 &&
      Object.keys(leaderboard.mostDonated[0]).length === 0
    ) &&
    !(
      leaderboard.mostRecent.length === 1 &&
      Object.keys(leaderboard.mostRecent[0]).length === 0
    );
  const tCommon = useTranslations('Common');
  const tLeaderboard = useTranslations('Leaderboard');
  const locale = useLocale();

  return (
    <section className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
        <h2>Tree Donation Tracker</h2>
        {isLeaderboardAvailable ? (
          <>
            <div className={styles.leaderBoardTableHeader}>
              <button
                id={'leaderBoardSecRecent'}
                onClick={() => setSelectedTab('recent')}
                className={
                  selectedTab === 'recent'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
              >
                {tLeaderboard('mostRecent')}
              </button>
              <button
                id={'leaderBoardSecHighest'}
                onClick={() => setSelectedTab('highest')}
                className={
                  selectedTab === 'highest'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
              >
                {tLeaderboard('mostTrees')}
              </button>
            </div>
            {selectedTab === 'recent' ? (
              <div className={styles.leaderBoardBody}>
                {leaderboard.mostRecent.map((leader, index) => {
                  return (
                    <div key={index} className={styles.leaderBoardBodyRow}>
                      <p className={styles.leaderBoardDonorName}>
                        {leader.donorName}
                      </p>
                      <p className={styles.leaderBoardDonorTrees}>
                        {getFormattedNumber(locale, Number(leader.treeCount))}{' '}
                        {tCommon('tree', {
                          count: Number(leader.treeCount),
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.leaderBoardBody}>
                {leaderboard.mostDonated.map((leader, index) => {
                  return (
                    <div key={index} className={styles.leaderBoardBodyRow}>
                      <p className={styles.leaderBoardDonorName}>
                        {leader.donorName}
                      </p>
                      <p className={styles.leaderBoardDonorTrees}>
                        {getFormattedNumber(locale, Number(leader.treeCount))}{' '}
                        {tCommon('tree', {
                          count: Number(leader.treeCount),
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div>Leaderboard data not available.</div>
        )}
      </div>
    </section>
  );
}

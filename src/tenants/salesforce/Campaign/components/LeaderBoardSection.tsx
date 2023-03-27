import React from 'react';
import styles from './../styles/LeaderBoardSection.module.scss';
import { useTranslation } from 'next-i18next';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';

interface Props {
  leaderboard: {
    mostDonated: { created: string; donorName: string; treeCount: string }[];
    mostRecent: { created: string; donorName: string; treeCount: string }[];
  };
}

export default function LeaderBoardSection({ leaderboard }: Props) {
  const [selectedTab, setSelectedTab] = React.useState('recent');
  const leaderboardData = leaderboard;
  const isLeaderboardAvailable =
    Object.keys(leaderboard.mostDonated).length +
      Object.keys(leaderboard.mostRecent).length >
    0;
  const { t, i18n, ready } = useTranslation(['leaderboard', 'common']);

  return ready ? (
    <div className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
        <h2>Tree Donation Tracker</h2>
        {isLeaderboardAvailable ? (
          <div className={styles.leaderBoardTable}>
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
                {t('leaderboard:mostRecent')}
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
                {t('leaderboard:mostTrees')}
              </button>
            </div>
            {leaderboardData &&
            leaderboardData.mostRecent &&
            leaderboardData.mostDonated ? (
              selectedTab === 'recent' ? (
                <div className={styles.leaderBoardBody}>
                  {leaderboardData.mostRecent.map((leader, index) => {
                    return (
                      <div key={index} className={styles.leaderBoardBodyRow}>
                        <p className={styles.leaderBoardDonorName}>
                          {leader.donorName}
                        </p>
                        <p className={styles.leaderBoardDonorTrees}>
                          {getFormattedNumber(
                            i18n.language,
                            Number(leader.treeCount)
                          )}{' '}
                          {t('common:tree', {
                            count: Number(leader.treeCount),
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.leaderBoardBody}>
                  {leaderboardData.mostDonated.map((leader, index) => {
                    return (
                      <div key={index} className={styles.leaderBoardBodyRow}>
                        <p className={styles.leaderBoardDonorName}>
                          {leader.donorName}
                        </p>
                        <p className={styles.leaderBoardDonorTrees}>
                          {getFormattedNumber(
                            i18n.language,
                            Number(leader.treeCount)
                          )}{' '}
                          {t('common:tree', {
                            count: Number(leader.treeCount),
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <p>loading</p>
            )}
          </div>
        ) : (
          <div>Leaderboard data not available.</div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}

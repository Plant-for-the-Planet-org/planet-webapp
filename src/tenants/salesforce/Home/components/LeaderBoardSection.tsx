import React from 'react';
import styles from './../styles/LeaderBoardSection.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';

interface Props {
  leaderboard: any;
}

export default function LeaderBoardSection(leaderboard: Props) {
  const [selectedTab, setSelectedTab] = React.useState('recent');
  const leaderboardData = leaderboard.leaderboard;
  const tLeaderboard = useTranslations('Leaderboard');
  const tCommon = useTranslations('Common');
  const locale = useLocale();

  return (
    <div className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
        <h2>Tree Donation Tracker</h2>
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
          {leaderboardData &&
          leaderboardData.mostRecent &&
          leaderboardData.mostDonated ? (
            selectedTab === 'recent' ? (
              <div className={styles.leaderBoardBody}>
                {leaderboardData.mostRecent.map((leader: any, index: any) => {
                  return (
                    <div key={index} className={styles.leaderBoardBodyRow}>
                      <p className={styles.leaderBoardDonorName}>
                        {leader.donorName}
                      </p>
                      <p className={styles.leaderBoardDonorTrees}>
                        {getFormattedNumber(locale, Number(leader.treeCount))}{' '}
                        {tCommon('tree', { count: Number(leader.treeCount) })}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.leaderBoardBody}>
                {leaderboardData.mostDonated.map((leader: any, index: any) => {
                  return (
                    <div key={index} className={styles.leaderBoardBodyRow}>
                      <p className={styles.leaderBoardDonorName}>
                        {leader.donorName}
                      </p>
                      <p className={styles.leaderBoardDonorTrees}>
                        {getFormattedNumber(locale, Number(leader.treeCount))}{' '}
                        {tCommon('tree', { count: Number(leader.treeCount) })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <p>loading</p>
          )}
        </>
      </div>
    </div>
  );
}

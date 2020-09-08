import React from 'react';
import styles from './../LeaderBoard.module.scss';

interface Props {
  leaderboard: any;
}

export default function LeaderBoardSection(leaderboard: Props) {
  const [selectedTab, setSelectedTab] = React.useState('recent');
  return (
    <section className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
        <h3>Salesforce</h3>
        <h2>Forest Frontrunners</h2>
        <div className={styles.leaderBoardTable}>
          <div className={styles.leaderBoardTableHeader}>
            <div
              onClick={() => setSelectedTab('recent')}
              className={
                selectedTab === 'recent'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              Most Recent
            </div>
            <div
              onClick={() => setSelectedTab('highest')}
              className={
                selectedTab === 'highest'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              Most Trees
            </div>
          </div>
          {leaderboard.leaderboard.leaderboard !== null ? (
            selectedTab === 'recent' ? (
              <div className={styles.leaderBoardBody}>
                {leaderboard.leaderboard.leaderboard.mostRecent.map(
                  (leader: any) => {
                    return (
                      <div className={styles.leaderBoardBodyRow}>
                        <p className={styles.leaderBoardDonorName}>
                          {leader.donorName}
                        </p>
                        <p className={styles.leaderBoardDonorTrees}>
                          {leader.treeCount} Trees
                        </p>
                        <p className={styles.leaderBoardDonorTime}>
                          {leader.created}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className={styles.leaderBoardBody}>
                {leaderboard.leaderboard.leaderboard.mostDonated.map(
                  (leader: any) => {
                    return (
                      <div className={styles.leaderBoardBodyRow}>
                        <p className={styles.leaderBoardDonorName}>
                          {leader.donorName}
                        </p>
                        <p className={styles.leaderBoardDonorTrees}>
                          {leader.treeCount} Trees
                        </p>
                        <p className={styles.leaderBoardDonorTime}>
                          {leader.created}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            )
          ) : (
            <p>loading</p>
          )}
        </div>
      </div>
      <img
        className={styles.leaderBoardBushImage}
        src={'/tenants/salesforce/images/Bush.png'}
      />
    </section>
  );
}

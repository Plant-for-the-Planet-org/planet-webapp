import React from 'react';
import Sugar from 'sugar';
import styles from './LeaderBoard.module.scss';

interface Props {
  leaderboard: any;
}

export default function LeaderBoardSection(leaderboard: Props) {
  const [selectedTab, setSelectedTab] = React.useState('recent');
  const leaderboardData = leaderboard.leaderboard;

  return (
    <section className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
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
          {leaderboardData !== null &&
            leaderboardData.mostRecent &&
            leaderboardData.mostDonated ? (
              selectedTab === 'recent' ? (
                <div className={styles.leaderBoardBody}>
                  {leaderboardData.mostRecent.map((leader: any) => {
                    return (
                      <div className={styles.leaderBoardBodyRow}>
                        <p className={styles.leaderBoardDonorName}>
                          {leader.donorName}
                        </p>
                        <p className={styles.leaderBoardDonorTrees}>
                          {Sugar.Number.format(Number(leader.treeCount))} Trees
                      </p>
                        {/* <p className={styles.leaderBoardDonorTime}>
                          {leader.created}
                        </p> */}
                      </div>
                    );
                  })}
                </div>
              ) : (
                  <div className={styles.leaderBoardBody}>
                    {leaderboardData.mostDonated.map((leader: any) => {
                      return (
                        <div className={styles.leaderBoardBodyRow}>
                          <p className={styles.leaderBoardDonorName}>
                            {leader.donorName}
                          </p>
                          <p className={styles.leaderBoardDonorTrees}>
                            {Sugar.Number.format(Number(leader.treeCount))} Trees
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
      </div>
      <img
        className={styles.leaderBoardBushImage}
        src={'/tenants/stern/images/leaderboard.svg'}
        alt=""
      />
      <img
        className={styles.leaderBoardGroupTreeImage}
        src={'/tenants/stern/images/treeGroup.svg'}
        alt=""
      />
      {/* <img
        className={styles.leaderBoardBushImageMobile}
        src={'/tenants/salesforce/images/mobile/Bush.png'}
        alt=""
      /> */}
    </section>
  );
}

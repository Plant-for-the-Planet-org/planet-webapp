import React from 'react';
import styles from './../About.module.scss';
export default function LeaderBoard() {
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
          <div className={styles.leaderBoardBody}>
            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>

            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>
            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>
            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>
            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>
            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>

            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>
            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>
            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>
            <div className={styles.leaderBoardBodyRow}>
              <p className={styles.leaderBoardDonorName}>Tin Lee</p>
              <p className={styles.leaderBoardDonorTrees}>5,000 Trees</p>
              <p className={styles.leaderBoardDonorTime}>30m ago</p>
            </div>
          </div>
        </div>
      </div>
      <img
        className={styles.leaderBoardBushImage}
        src={'/tenants/salesforce/images/Bush.png'}
      />
    </section>
  );
}

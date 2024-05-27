import { useState } from 'react';
import styles from './communityContributions.module.scss';
import { leaderboard } from './dummyData';

const CommunityContributions = () => {
  const [tabSelected, setTabSelected] = useState('most-recent');
  const [leaderboardList, setLeaderboardList] = useState([]);
  const handleTabChange = (selectedTab: string) => {
    setTabSelected(selectedTab);
    if (selectedTab === 'most-recent') {
      setLeaderboardList(leaderboard.mostRecent);
    } else {
      setLeaderboardList(leaderboard.mostTrees);
    }
  };
  return (
    <div className={styles.communityContributions}>
      <div className={styles.header}>
        {/* <div className={styles.infoIcon}>
          <ProfileInfoIcon />
        </div> */}
        <div className={styles.headerItems}>
          <h2 className={styles.headerTitle}>Community Contributions</h2>
          <div className={styles.headerTabs}>
            <button
              onClick={() => handleTabChange('most-recent')}
              className={`${
                tabSelected === 'most-recent' ? styles.selected : ''
              }`}
            >
              Most recent
            </button>
            <button
              onClick={() => handleTabChange('most-trees')}
              className={`${
                tabSelected === 'most-trees' ? styles.selected : ''
              }`}
            >
              Most trees
            </button>
          </div>
        </div>
      </div>
      <ul className={styles.leaderboardList}>
        {leaderboardList.map((item, index) => (
          <>
            <li key={index}>
              <span>{item.name}</span>
              <span className={styles.units}>
                {item.units} {item.unitType}
              </span>
            </li>
            <div className={styles.horizontalLine}></div>
          </>
        ))}
      </ul>
    </div>
  );
};

export default CommunityContributions;

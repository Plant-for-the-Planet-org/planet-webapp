import { useState } from 'react';
import styles from './communityContributions.module.scss';
import { leaderboard } from './dummyData';
import { ProfileInfoIcon } from '../../../../../public/assets/images/icons/ProfilePageV2Icons';
import InfoIconPopup from './InfoIconPopup';

const CommunityContributions = () => {
  const [tabSelected, setTabSelected] = useState('most-recent');
  const [leaderboardList, setLeaderboardList] = useState([]);
  const isMobile = typeof window !== `undefined` && window.innerWidth <= 481;

  const handleTabChange = (selectedTab: string) => {
    setTabSelected(selectedTab);
    if (selectedTab === 'most-recent') {
      setLeaderboardList(leaderboard.mostRecent);
    } else {
      setLeaderboardList(leaderboard.mostTrees);
    }
  };

  const HeaderTabs = () => {
    return (
      <div className={styles.headerTabs}>
        <button
          onClick={() => handleTabChange('most-recent')}
          className={`${tabSelected === 'most-recent' ? styles.selected : ''}`}
        >
          Most recent
        </button>
        <button
          onClick={() => handleTabChange('most-trees')}
          className={`${tabSelected === 'most-trees' ? styles.selected : ''}`}
        >
          Most trees
        </button>
      </div>
    );
  };

  return (
    <div className={styles.communityContributions}>
      <div className={styles.header}>
        <div className={styles.infoIcon}>
          <InfoIconPopup height={15} width={15} color={'#828282'}>
            <div className={styles.infoIconPopupContainer}>
              Community contributions are all tree, restoration or conservation
              donations that are dedicated to you, for instance by donating via
              your profile
            </div>
          </InfoIconPopup>
        </div>
        <div className={styles.headerItems}>
          <h2 className={styles.headerTitle}>Community Contributions</h2>
          {!isMobile && <HeaderTabs />}
        </div>
      </div>
      {/* header tabs for mobile screens */}
      <div className={styles.mobileHeaderTabContainer}>
        <HeaderTabs />
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

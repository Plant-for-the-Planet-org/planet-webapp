import { useState } from 'react';
import styles from './communityContributions.module.scss';
import { leaderboard } from './dummyData';
import NoContributions from './NoContributions';
import { ProfileV2Props } from '../../../common/types/profile';
import ContributionListItem from './ContributionListItem';
import CustomTooltip from './CustomTooltip';

const CommunityContributions = ({
  profileType,
  userProfile,
}: ProfileV2Props) => {
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
          <CustomTooltip height={15} width={15} color={'#828282'}>
            <div className={styles.infoIconPopupContainer}>
              Community contributions are all tree, restoration or conservation
              donations that are dedicated to you, for instance by donating via
              your profile
            </div>
          </CustomTooltip>
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
      {leaderboardList.length > 0 ? (
        <ul className={styles.leaderboardList}>
          {leaderboardList.map((item, index) => (
            <>
              <ContributionListItem
                key={index}
                name={item.name}
                units={item.units}
                unitType={item.unitType}
              />
              <div className={styles.horizontalLine}></div>
            </>
          ))}
        </ul>
      ) : (
        <NoContributions profileType={profileType} userProfile={userProfile} />
      )}
    </div>
  );
};

export default CommunityContributions;

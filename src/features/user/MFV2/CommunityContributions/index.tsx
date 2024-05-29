import { useContext, useEffect, useState } from 'react';
import styles from './communityContributions.module.scss';
import NoContributions from './NoContributions';
import { ProfileV2Props } from '../../../common/types/profile';
import ContributionListItem from './ContributionListItem';
import CustomTooltip from './CustomTooltip';
import { trpc } from '../../../../utils/trpc';
import { updateStateWithTrpcData } from '../../../../utils/trpcHelpers';
import { Leaderboard, LeaderboardItem } from '../../../common/types/myForestv2';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

const CommunityContributions = ({
  profileType,
  userProfile,
}: ProfileV2Props) => {
  const [tabSelected, setTabSelected] = useState('most-recent');
  const [leaderboardList, setLeaderboardList] = useState<
    Leaderboard | undefined
  >(undefined);
  const [contributionList, setContributionList] = useState<LeaderboardItem[]>(
    []
  );
  const isMobile = typeof window !== `undefined` && window.innerWidth <= 481;
  const { setErrors } = useContext(ErrorHandlingContext);

  const handleTabChange = (selectedTab: string) => {
    setTabSelected(selectedTab);
    setContributionList([]);
    if (selectedTab === 'most-recent') {
      setContributionList(leaderboardList?.mostRecent || []);
    } else if (selectedTab === 'most-trees') {
      setContributionList(leaderboardList?.mostTrees || []);
    }
  };

  const _leaderboard = trpc.myForestV2.leaderboard.useQuery({
    profileId: `${userProfile?.id}`,
    slug: `${userProfile?.slug}`,
  });

  useEffect(() => {
    if (_leaderboard.data) {
      updateStateWithTrpcData(_leaderboard, setLeaderboardList, setErrors);
      setLeaderboardList(_leaderboard.data);
    }
  }, [_leaderboard?.data, userProfile]);

  useEffect(() => {
    setContributionList(leaderboardList?.mostRecent || []);
  }, [leaderboardList]);

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
      {contributionList.length > 0 ? (
        <ul className={styles.leaderboardList}>
          {contributionList.map((item, index) => (
            <>
              <ContributionListItem
                key={index}
                name={item.name}
                units={item.units}
                unitType={item.unitType}
                purpose={item.purpose}
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

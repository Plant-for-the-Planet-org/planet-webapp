import { useEffect, useState } from 'react';
import styles from './communityContributions.module.scss';
import NoContributions from './NoContributions';
import { ProfileV2Props } from '../../../common/types/profile';
import ContributionListItem from './ContributionListItem';
import CustomTooltip from './CustomTooltip';
import { LeaderboardItem } from '../../../common/types/myForestv2';
import { ProfileLoader } from '../../../common/ContentLoaders/ProfileV2';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';

const CommunityContributions = ({
  profileType,
  userProfile,
}: ProfileV2Props) => {
  const [tabSelected, setTabSelected] = useState('most-recent');
  const { leaderboardResult, isLeaderboardLoaded } = useMyForestV2();
  //stores list for tabSelected
  const [contributionList, setContributionList] = useState<LeaderboardItem[]>(
    []
  );
  const isMobile = typeof window !== `undefined` && window.innerWidth <= 481;
  const t = useTranslations('Profile');

  const handleTabChange = (selectedTab: string) => {
    setTabSelected(selectedTab);
    if (selectedTab === 'most-recent') {
      setContributionList(leaderboardResult?.mostRecent || []);
    } else if (selectedTab === 'most-trees') {
      setContributionList(leaderboardResult?.mostTrees || []);
    }
  };

  useEffect(() => {
    setContributionList(leaderboardResult?.mostRecent || []);
  }, [leaderboardResult]);

  const HeaderTabs = () => {
    return (
      <div className={styles.headerTabs}>
        <button
          onClick={() => handleTabChange('most-recent')}
          className={`${tabSelected === 'most-recent' ? styles.selected : ''}`}
        >
          {t('communityContributions.mostRecentTabLabel')}
        </button>
        <button
          onClick={() => handleTabChange('most-trees')}
          className={`${tabSelected === 'most-trees' ? styles.selected : ''}`}
        >
          {t('communityContributions.mostTreesTabLabel')}
        </button>
      </div>
    );
  };

  const RenderContributionsList = () => {
    return contributionList.length > 0 ? (
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
      <NoContributions
        {...(profileType === 'private'
          ? { profileType: 'private', userProfile: userProfile }
          : { profileType: 'public', userProfile: userProfile })}
      />
    );
  };

  return isLeaderboardLoaded ? (
    <div className={styles.communityContributions}>
      <div className={styles.header}>
        <div className={styles.infoIcon}>
          <CustomTooltip height={15} width={15} color={'#828282'}>
            <div className={styles.infoIconPopupContainer}>
              {t('communityContributions.tooltipText')}
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
      <RenderContributionsList />
    </div>
  ) : (
    <ProfileLoader />
  );
};

export default CommunityContributions;

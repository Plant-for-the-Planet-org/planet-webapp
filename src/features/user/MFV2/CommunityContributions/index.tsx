import { useEffect, useState } from 'react';
import styles from './communityContributions.module.scss';
import NoContributions from './NoContributions';
import { ProfileV2Props } from '../../../common/types/profile';
import ContributionListItem from './ContributionListItem';
import CustomTooltip from './CustomTooltip';
import { LeaderboardItem } from '../../../common/types/myForestv2';
import { useTranslations } from 'next-intl';
import { useMyForestV2 } from '../../../common/Layout/MyForestContextV2';
import CommunityContributionsIcon from '../../../../../public/assets/images/icons/CommunityContributionsIcon';

type TabOptions = 'most-recent' | 'most-trees';
interface HeaderTabsProps {
  tabSelected: TabOptions;
  handleTabChange: (selectedTab: TabOptions) => void;
}

const HeaderTabs = ({ tabSelected, handleTabChange }: HeaderTabsProps) => {
  const t = useTranslations('Profile');
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

const ContributionsList = ({
  contributionList,
}: {
  contributionList: LeaderboardItem[];
}) => {
  if (contributionList.length === 0) return null;

  return (
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
  );
};

const CommunityContributions = ({
  profilePageType,
  userProfile,
}: ProfileV2Props) => {
  const [tabSelected, setTabSelected] = useState<TabOptions>('most-recent');
  const { leaderboardResult } = useMyForestV2();
  //stores list for tabSelected
  const [contributionList, setContributionList] = useState<LeaderboardItem[]>(
    []
  );
  const t = useTranslations('Profile');

  const handleTabChange = (selectedTab: TabOptions) => {
    setTabSelected(selectedTab);
    if (selectedTab === 'most-recent') {
      setContributionList(leaderboardResult?.mostRecent || []);
    } else {
      setContributionList(leaderboardResult?.mostTrees || []);
    }
  };

  useEffect(() => {
    setContributionList(leaderboardResult?.mostRecent || []);
  }, [leaderboardResult]);

  return (
    <div className={styles.communityContributions}>
      <div className={styles.header}>
        <div className={styles.infoIcon}>
          <CustomTooltip height={15} width={15} color={'#828282'}>
            <div className={styles.infoIconPopupContainer}>
              {profilePageType === 'private'
                ? t('communityContributions.tooltipText')
                : t('communityContributions.tooltipTextPublic')}
            </div>
          </CustomTooltip>
        </div>
        <div className={styles.headerItems}>
          <h2 className={styles.headerTitle}>
            {t('communityContributions.title')}
          </h2>
          <HeaderTabs
            tabSelected={tabSelected}
            handleTabChange={handleTabChange}
          />
        </div>
        <div className={styles.iconContainer}>
          <CommunityContributionsIcon />
        </div>
      </div>
      {/* header tabs for mobile screens */}
      <div className={styles.mobileHeaderTabContainer}>
        <HeaderTabs
          tabSelected={tabSelected}
          handleTabChange={handleTabChange}
        />
      </div>
      {contributionList.length > 0 ? (
        <ContributionsList contributionList={contributionList} />
      ) : (
        <NoContributions
          {...(profilePageType === 'private'
            ? { profilePageType: 'private', userProfile: userProfile }
            : { profilePageType: 'public', userProfile: userProfile })}
        />
      )}
    </div>
  );
};

export default CommunityContributions;

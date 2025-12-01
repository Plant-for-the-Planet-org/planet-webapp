import type { ProfileV2Props } from '../../../common/types/profile';
import type { LeaderboardItem } from '../../../common/types/myForest';
import type { SetState } from '../../../common/types/common';

import { Fragment, useState } from 'react';
import styles from './communityContributions.module.scss';
import NoContributions from './NoContributions';
import ContributionListItem from './ContributionListItem';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import { useTranslations } from 'next-intl';
import CommunityContributionsIcon from '../../../../../public/assets/images/icons/CommunityContributionsIcon';
import themeProperties from '../../../../theme/themeProperties';
import NewInfoIcon from '../../../../../public/assets/images/icons/projectV2/NewInfoIcon';
import { useMyForestStore } from '../../../../stores/myForestStore';

type TabOptions = 'most-recent' | 'most-trees';
interface HeaderTabsProps {
  tabSelected: TabOptions;
  setTabSelected: SetState<TabOptions>;
}

const HeaderTabs = ({ tabSelected, setTabSelected }: HeaderTabsProps) => {
  const t = useTranslations('Profile');
  return (
    <div className={styles.headerTabs}>
      <button
        onClick={() => setTabSelected('most-recent')}
        className={`${tabSelected === 'most-recent' ? styles.selected : ''}`}
      >
        {t('communityContributions.mostRecentTabLabel')}
      </button>
      <button
        onClick={() => setTabSelected('most-trees')}
        className={`${tabSelected === 'most-trees' ? styles.selected : ''}`}
      >
        {t('communityContributions.mostTreesTabLabel')}
      </button>
    </div>
  );
};

const ContributionsList = ({
  contributionList,
  tabSelected,
}: {
  contributionList: LeaderboardItem[];
  tabSelected: TabOptions;
}) => {
  if (contributionList.length === 0) return null;

  return (
    <ul className={styles.leaderboardList}>
      {contributionList.map((item, index) => (
        <Fragment
          key={`${tabSelected}-${item.units}-${item.unitType}-${index}`}
        >
          <ContributionListItem
            name={item.name}
            units={item.units}
            unitType={item.unitType}
            purpose={item.purpose}
          />
          <div className={styles.horizontalLine}></div>
        </Fragment>
      ))}
    </ul>
  );
};

const CommunityContributions = ({
  profilePageType,
  userProfile,
}: ProfileV2Props) => {
  const t = useTranslations('Profile');
  const [tabSelected, setTabSelected] = useState<TabOptions>('most-recent');

  const mostRecentContributions = useMyForestStore(
    (state) => state.leaderboardResult?.mostRecent
  );
  const mostTreesContributions = useMyForestStore(
    (state) => state.leaderboardResult?.mostTrees
  );
  const contributionList =
    tabSelected === 'most-recent'
      ? mostRecentContributions || []
      : mostTreesContributions || [];

  return (
    <div className={styles.communityContributions}>
      <div className={styles.header}>
        <div className={styles.infoIcon}>
          <CustomTooltip
            triggerElement={
              <NewInfoIcon
                width={14}
                color={themeProperties.designSystem.colors.softText2}
              />
            }
            showTooltipPopups={true}
          >
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
            setTabSelected={setTabSelected}
          />
        </div>
        <div className={styles.iconContainer}>
          <CommunityContributionsIcon />
        </div>
      </div>
      {/* header tabs for mobile screens */}
      <div className={styles.mobileHeaderTabContainer}>
        <HeaderTabs tabSelected={tabSelected} setTabSelected={setTabSelected} />
      </div>
      {contributionList.length > 0 ? (
        <ContributionsList
          contributionList={contributionList}
          tabSelected={tabSelected}
        />
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

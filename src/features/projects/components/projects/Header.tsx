import type { ReactElement } from 'react';
import type { SetState } from '../../../common/types/common';
import type { MapProject } from '../../../common/types/ProjectPropsContextInterface';

import React from 'react';
import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import { useTranslations } from 'next-intl';

interface Props {
  showTopProjectsList: boolean;
  setSelectedTab: SetState<'top' | 'all'>;
  selectedTab: 'top' | 'all';
  setSearchMode: SetState<boolean>;
  projects: MapProject[];
}

function Header({
  showTopProjectsList,
  setSelectedTab,
  selectedTab,
  setSearchMode,
  projects,
}: Props): ReactElement {
  const t = useTranslations('Donate');
  return (
    <div className={'header'}>
      {showTopProjectsList ? (
        <div className={'tabButtonContainer'}>
          <div className={'tabButton'} onClick={() => setSelectedTab('top')}>
            <div
              className={
                selectedTab === 'top' ? 'tabButtonSelected' : 'tabButtonText'
              }
            >
              {t('topProjects')}
            </div>
            {selectedTab === 'top' ? (
              <div className={'tabButtonSelectedIndicator'} />
            ) : null}
          </div>

          <div className={'tabButton'} onClick={() => setSelectedTab('all')}>
            <div
              className={
                selectedTab === 'all' ? 'tabButtonSelected' : 'tabButtonText'
              }
            >
              {t('allCountProjects', {
                projectCount: projects.length,
              })}
            </div>
            {selectedTab === 'all' ? (
              <div className={'tabButtonSelectedIndicator'} />
            ) : null}
          </div>
        </div>
      ) : (
        <p className={'headerText'}>{t('stopTalkingStartPlanting')}</p>
      )}

      <button
        id={'searchIcon'}
        data-test-id="searchIcon"
        className={'searchIcon'}
        onClick={() => setSearchMode(true)}
      >
        <SearchIcon />
      </button>
    </div>
  );
}

export default Header;

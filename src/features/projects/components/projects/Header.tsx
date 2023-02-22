import React, { ReactElement } from 'react';
import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import { useTranslation } from 'next-i18next';

interface Props {
  showTopProjectsList: boolean;
  setSelectedTab: Function;
  selectedTab: 'top' | 'all';
  setSearchMode: Function;
  projects: any;
}

function Header({
  showTopProjectsList,
  setSelectedTab,
  selectedTab,
  setSearchMode,
  projects,
}: Props): ReactElement {
  const { t, ready } = useTranslation(['donate']);
  return ready ? (
    <div className={'header'}>
      {showTopProjectsList ? (
        <div className={'tabButtonContainer'}>
          <div className={'tabButton'} onClick={() => setSelectedTab('top')}>
            <div
              className={
                selectedTab === 'top' ? 'tabButtonSelected' : 'tabButtonText'
              }
            >
              {t('donate:topProjects')}
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
              {t('donate:allCountProjects', {
                projectCount: projects.length,
              })}
            </div>
            {selectedTab === 'all' ? (
              <div className={'tabButtonSelectedIndicator'} />
            ) : null}
          </div>
        </div>
      ) : (
        <p className={'headerText'}>{t('donate:stopTalkingStartPlanting')}</p>
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
  ) : (
    <></>
  );
}

export default Header;

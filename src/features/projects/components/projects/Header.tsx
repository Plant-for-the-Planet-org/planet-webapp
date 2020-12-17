import React, { ReactElement } from 'react'
import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import i18next from '../../../../../i18n/'

interface Props {
    showFeaturedList:any;
    setSelectedTab:Function;
    selectedTab:any;
    setSearchMode:Function;
    projects:any;
}
const { useTranslation } = i18next;

function Header({showFeaturedList,setSelectedTab,selectedTab,setSearchMode,projects}: Props): ReactElement {
    const { t, ready } = useTranslation(['donate']);
    return ready ? (
        <div className={'header'}>
            {showFeaturedList ? (
              <div className={'tabButtonContainer'}>
                <div
                  className={'tabButton'}
                  onClick={() => setSelectedTab('featured')}
                >
                  <div
                    className={
                      selectedTab === 'featured'
                        ? 'tabButtonSelected'
                        : 'tabButtonText'
                    }
                  >
                    {t('donate:topProjects')}
                  </div>
                  {selectedTab === 'featured' ? (
                    <div className={'tabButtonSelectedIndicator'} />
                  ) : null}
                </div>

                <div
                  className={'tabButton'}
                  onClick={() => setSelectedTab('all')}
                >
                  <div
                    className={
                      selectedTab === 'all'
                        ? 'tabButtonSelected'
                        : 'tabButtonText'
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
                <p className={'headerText'}>
                  {t('donate:stopTalkingStartPlanting')}
                </p>
              )}

            <div
              className={'searchIcon'}
              onClick={() => setSearchMode(true)}
            >
              <SearchIcon />
            </div>
          </div>
    ) : null;
}

export default Header

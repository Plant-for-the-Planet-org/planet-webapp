import React, { ReactElement } from 'react'
import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import styles from '../../styles/Projects.module.scss';
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
    const { t } = useTranslation(['donate']);
    return (
        <div className={styles.header}>
            {showFeaturedList ? (
              <div className={styles.tabButtonContainer}>
                <div
                  className={styles.tabButton}
                  onClick={() => setSelectedTab('featured')}
                >
                  <div
                    className={
                      selectedTab === 'featured'
                        ? styles.tabButtonSelected
                        : styles.tabButtonText
                    }
                  >
                    {t('donate:topProjects')}
                  </div>
                  {selectedTab === 'featured' ? (
                    <div className={styles.tabButtonSelectedIndicator} />
                  ) : null}
                </div>

                <div
                  className={styles.tabButton}
                  onClick={() => setSelectedTab('all')}
                >
                  <div
                    className={
                      selectedTab === 'all'
                        ? styles.tabButtonSelected
                        : styles.tabButtonText
                    }
                  >
                    {t('donate:allCountProjects', {
                      projectCount: projects.length,
                    })}
                  </div>
                  {selectedTab === 'all' ? (
                    <div className={styles.tabButtonSelectedIndicator} />
                  ) : null}
                </div>
              </div>
            ) : (
                <p className={styles.headerText}>
                  {t('donate:stopTalkingStartPlanting')}
                </p>
              )}

            <div
              className={styles.searchIcon}
              onClick={() => setSearchMode(true)}
            >
              <SearchIcon />
            </div>
          </div>
    )
}

export default Header

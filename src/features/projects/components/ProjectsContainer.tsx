import { TextField } from '@material-ui/core';
import dynamic from 'next/dynamic';
import React from 'react';
import ProjectLoader from '../../common/ContentLoaders/Projects/ProjectLoader';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import SearchIcon from '../../../../public/assets/images/icons/SearchIcon';
import styles from './../styles/Projects.module.scss';
import i18next from '../../../../i18n/'
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../public/assets/images/NotFound';

const { useTranslation } = i18next;
const ProjectSnippet = dynamic(() => import('./ProjectSnippet'), {
  loading: () => <ProjectLoader />,
});
interface Props {
  projects: any;
  setSearchedProjects: Function;
  directGift: any;
  setDirectGift: Function;
}
export default function ProjectsContainer({
  projects,
  setSearchedProjects,
  directGift,
  setDirectGift,
}: Props) {
  const { t } = useTranslation(['donate']);

  const screenWidth = window.innerWidth;
  const [isMobile, setIsMobile] = React.useState(screenWidth <= 767);
  const featuredList = process.env.NEXT_PUBLIC_FEATURED_LIST;

  const showFeaturedList =
    featuredList === 'false' || featuredList === '0' ? false : true;

  const [selectedTab, setSelectedTab] = React.useState('all');
  const [searchMode, setSearchMode] = React.useState(false);

  React.useEffect(() => {
    showFeaturedList ? setSelectedTab('featured') : null;
  }, []);

  const [searchValue, setSearchValue] = React.useState('');

  const searchRef = React.useRef(null);

  function getProjects(projects: Array<any>, type: string) {
    if (type === 'featured') {
      return projects.filter(
        (project: { properties: { isFeatured: boolean } }) =>
          project.properties.isFeatured === true
      );
    } else if (type === 'all') {
      return projects;
    }
  }

  function getSearchProjects(projects: Array<any>, keyword: string) {
    let resultProjects = [];
    if (keyword !== '') {
      resultProjects = projects.filter(function (project) {
        if (
          project.properties.name.toLowerCase().includes(keyword.toLowerCase())
        ) {
          return true;
        } else if (
          project.properties.location &&
          project.properties.location
            .toLowerCase()
            .includes(keyword.toLowerCase())
        ) {
          return true;
        } else if (
          project.properties.tpo.name &&
          project.properties.tpo.name
            .toLowerCase()
            .includes(keyword.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      });
      setSearchedProjects(resultProjects);
      return resultProjects;
    } else {
      setSearchedProjects(projects);
    }
  }

  const allProjects = React.useMemo(() => getProjects(projects, 'all'), [
    projects,
  ]);

  const searchProjectResults = React.useMemo(
    () => getSearchProjects(projects, searchValue),
    [searchValue]
  );

  const featuredProjects = React.useMemo(
    () => getProjects(projects, 'featured'),
    [projects]
  );

  const AllProjects = (projects:any)=>{   
    if (projects.projects.length < 1) {
      return (
        <div className={styles.projectNotFound}>
          <LazyLoad>
            <NotFound className={styles.projectNotFoundImage} />
            <h5>{t('donate:noProjectsFound')}</h5>
          </LazyLoad>
        </div>
      );
    }
    else {
      return (
        projects.projects.map((project: any) => {
          return (
            <ProjectSnippet
              key={project.properties.id}
              project={project}
              directGift={directGift}
              setDirectGift={setDirectGift}
              editMode={false}
            />
          );
        })
      ) 
    } 
  }

  const SearchField =()=>{
    return(
      <>
      <div className={styles.searchIcon}>
            <SearchIcon color={styles.primaryFontColor} />
          </div>

          <div className={styles.searchInput}>
            <TextField
              ref={searchRef}
              fullWidth={true}
              autoFocus={true}
              placeholder={t('donate:searchProjects')}
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
          </div>
          <div
            className={styles.cancelIcon}
            onClick={() => {
              setSearchMode(false);
              setSearchValue('');
            }}
          >
            <CancelIcon color={styles.primaryFontColor} />
          </div>
      </>
    )
  }

  const Header =()=>{
    return(
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
  return (
    <>
     <div className={styles.header} style={isMobile ? { height: '66px', paddingTop: '16px' } : {}}>
      {isMobile ? <div className={styles.dragBar}></div> : null}
      {searchMode ? <SearchField/> :<Header/>}
      </div>
      {/* till here is header */}
      <div className={styles.projectsContainer}>
        <div className={styles.projectsContainerChild}>
        {searchValue !== '' ?
          <AllProjects projects={searchProjectResults} />
          : selectedTab === 'all' ? 
            <AllProjects projects={allProjects} /> : 
            <AllProjects projects={featuredProjects} />}
        </div>        
      </div>
      
    </>
  );
}

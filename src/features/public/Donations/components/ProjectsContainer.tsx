import { TextField } from '@material-ui/core';
import dynamic from 'next/dynamic';
import React from 'react';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import CancelIcon from './../../../../assets/images/icons/CancelIcon';
import SearchIcon from './../../../../assets/images/icons/SearchIcon';
import styles from './../styles/Projects.module.scss';

interface Props {
  projects: any;
  setShowSingleProject: Function;
  fetchSingleProject: Function;
  setLayoutId: Function;
  yScroll: any;
  setSearchedProjects: Function;
}

const AllProjects = dynamic(() => import('../components/AllProjects'), {
  ssr: false,
  loading: () => <ProjectLoader />,
});

export default function ProjectsContainer({
  projects,
  setShowSingleProject,
  fetchSingleProject,
  setLayoutId,
  yScroll,
  setSearchedProjects,
}: Props) {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 1024;

  const [touchMap, setTouchMap] = React.useState(false);

  const featuredList = process.env.NEXT_PUBLIC_FEATURED_LIST;

  const showFeaturedList =
    featuredList === 'false' || featuredList === '0' ? false : true;

  const [selectedTab, setSelectedTab] = React.useState('all');
  const [searchMode, setSearchMode] = React.useState(false);

  React.useEffect(() => {
    showFeaturedList ? setSelectedTab('featured') : null;
    showFeaturedList ? null : setSearchMode(true);
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
    }
    setSearchedProjects(resultProjects);
    return resultProjects;
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

  const AllProjectsProps = {
    projects: allProjects,
    setShowSingleProject,
    fetchSingleProject,
    setLayoutId,
  };
  const SearchResultProjectsProps = {
    projects: searchProjectResults,
    setShowSingleProject,
    fetchSingleProject,
    setLayoutId,
  };
  const FeaturedProjectsProps = {
    projects: featuredProjects,
    setShowSingleProject,
    fetchSingleProject,
    setLayoutId,
  };

  const projectsContainer = React.useRef(null);

  React.useEffect(() => {
    if (!isMobile) {
      let Ref = projectsContainer.current;
      var wheelEvent =
        'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
      function preventDefault(e) {
        e.preventDefault();
      }

      var wheelOpt = false;
      Ref.scrollTo({ top: yScroll, behaviour: 'smooth' });
      Ref.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
      Ref.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop

      return () => {
        Ref.removeEventListener('DOMMouseScroll', preventDefault, false);
        Ref.removeEventListener(wheelEvent, preventDefault, wheelOpt);
      };
    }
  });
  return (
    <div
      style={
        touchMap
          ? { top: '80vh', overflow: 'hidden', transition: 'ease 0.5s' }
          : { top: 0, overflow: 'scroll' }
      }
      className={styles.container}
    >
      {!touchMap ? (
        <div
          className={styles.avoidPointerEvents}
          onTouchMove={() => {
            setTouchMap(true);
          }}
        ></div>
      ) : null}
      <div className={styles.containerChild}>
        <div className={styles.cardContainer}>
          {searchMode ? (
            <div className={styles.headerSearchMode}>
              <div className={styles.searchIcon}>
                <SearchIcon color={styles.primaryFontColor} />
              </div>

              <div className={styles.searchInput}>
                <TextField
                  ref={searchRef}
                  fullWidth={true}
                  autoFocus={true}
                  placeholder="Search Projects"
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                />
              </div>
              <div
                className={styles.cancelIcon}
                onClick={() => {
                  showFeaturedList ? setSearchMode(false) : null;
                  setSearchValue('');
                  console.log(searchRef);
                }}
              >
                <CancelIcon color={styles.primaryFontColor} />
              </div>
            </div>
          ) : (
            <div
              onTouchMove={() => {
                setTouchMap(false);
              }}
              className={styles.header}
            >
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
                      Top Projects
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
                      All {projects.length} Projects
                    </div>
                    {selectedTab === 'all' ? (
                      <div className={styles.tabButtonSelectedIndicator} />
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div
                className={styles.searchIcon}
                onClick={() => setSearchMode(true)}
              >
                <SearchIcon />
              </div>
            </div>
          )}
          {/* till here is header */}
          <div className={styles.projectsContainer} ref={projectsContainer}>
            {searchValue !== '' ? (
              <AllProjects {...SearchResultProjectsProps} />
            ) : selectedTab === 'all' ? (
              <AllProjects {...AllProjectsProps} />
            ) : (
              <AllProjects {...FeaturedProjectsProps} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

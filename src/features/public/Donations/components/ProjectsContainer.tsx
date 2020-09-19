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
  setSearchedProjects: Function;
  projectsContainer: any;
}

const AllProjects = dynamic(() => import('../components/AllProjects'), {
  ssr: false,
  loading: () => <ProjectLoader />,
});

export default function ProjectsContainer({
  projects,
  setShowSingleProject,
  fetchSingleProject,
  setSearchedProjects,
}: Props) {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const featuredList = process.env.NEXT_PUBLIC_FEATURED_LIST;

  const showFeaturedList =
    featuredList === 'false' || featuredList === '0' ? false : true;

  const [selectedTab, setSelectedTab] = React.useState('all');
  const [searchMode, setSearchMode] = React.useState(false);

  React.useEffect(() => {
    showFeaturedList ? setSelectedTab('featured') : null;
    // showFeaturedList ? null : setSearchMode(true);
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
  };
  const SearchResultProjectsProps = {
    projects: searchProjectResults,
    setShowSingleProject,
    fetchSingleProject,
  };
  const FeaturedProjectsProps = {
    projects: featuredProjects,
    setShowSingleProject,
    fetchSingleProject,
  };

  return (
    <>
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
              setSearchMode(false);
              setSearchValue('');
            }}
          >
            <CancelIcon color={styles.primaryFontColor} />
          </div>
        </div>
      ) : (
          <div
            className={styles.header}
            style={isMobile ? { height: '66px', paddingTop: '16px' } : {}}
          >
            {isMobile ? <div className={styles.dragBar}></div> : null}
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
            ) : (
                <p className={styles.headerText}>Stop Talking. Start Planting.</p>
              )}

            <div
              className={styles.searchIcon}
              onClick={() => setSearchMode(true)}
            >
              <SearchIcon />
            </div>
          </div>
        )}
      {/* till here is header */}
      <div className={styles.projectsContainer}>
        {searchValue !== '' ? (
          <AllProjects {...SearchResultProjectsProps} />
        ) : selectedTab === 'all' ? (
          <AllProjects {...AllProjectsProps} />
        ) : (
              <AllProjects {...FeaturedProjectsProps} />
            )}
      </div>
    </>
  );
}

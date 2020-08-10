import { TextField } from '@material-ui/core';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import CancelIcon from './../../../../assets/images/icons/CancelIcon';
import SearchIcon from './../../../../assets/images/icons/SearchIcon';
import styles from './../styles/Projects.module.scss';

const MapLayout = dynamic(() => import('./MapboxMap'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const AllProjects = dynamic(() => import('../components/AllProjects'), {
  ssr: false,
  loading: () => <ProjectLoader />,
});
interface Props {
  projects: any;
}

function ProjectsList({ projects }: Props): ReactElement {
  const [selectedTab, setSelectedTab] = React.useState('featured');
  const [searchMode, setSearchMode] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const [isScrolling, setIsScrolling] = React.useState(false);
  const [clientY, setClientY] = React.useState(
    window.innerWidth >= 768 ? 60 : 0
  );
  const [top, setTop] = React.useState(window.innerWidth >= 768 ? 60 : 200);
  const projectContainer = React.useRef(null);

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
      resultProjects = projects.filter(
        (project: { properties: { name: string } }) =>
          project.properties.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }
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
  };
  const SearchResultProjectsProps = {
    projects: searchProjectResults,
  };
  const FeaturedProjectsProps = {
    projects: featuredProjects,
  };
  const ProjectsProps = {
    projects: projects,
  };

  // when touched on the project list container enables scrolling of list and
  // sets the current y-axis touch position in clientY
  function onTouchStart(e: any) {
    if (window.innerWidth <= 768) {
      setIsScrolling(true);
      setClientY(e.touches[0].clientY);
    }
  }

  // when finger is dragged new on the list it adjusts the margin of the container accordingly
  function onTouchMove(e: any) {
    if (isScrolling) {
      let newTop = top + (e.touches[0].clientY - clientY);
      if (newTop >= 0 && newTop <= window.innerHeight - 100) {
        setTop(newTop);
        setClientY(e.touches[0].clientY);
      }
    }
  }

  // when finger is removed from the surface or interupted then stops the scrolling of list
  function onTouchEnd() {
    if (window.innerWidth <= 768) {
      setIsScrolling(false);
    }
  }
  return (
    <div onTouchMove={onTouchMove}>
      <MapLayout
        {...ProjectsProps}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />
      <div
        className={styles.container}
        style={{
          marginTop: top,
          height:
            window.innerWidth <= 768
              ? window.innerHeight - 76 - top
              : window.innerHeight - 76,
        }}
      >
        <div
          className={styles.cardContainer}
          ref={projectContainer}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          {searchMode ? (
            <div className={styles.headerSearchMode}>
              <div className={styles.searchIcon}>
                <SearchIcon />
              </div>

              <div className={styles.searchInput}>
                <TextField
                  fullWidth={true}
                  autoFocus={true}
                  placeholder="Search Projects"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div
                className={styles.cancelIcon}
                onClick={() => {
                  setSearchMode(false);
                  setSearchValue('');
                }}
              >
                <CancelIcon />
              </div>
            </div>
          ) : (
            <div className={styles.header}>
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
                    Transparent Projects
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

              <div
                className={styles.searchIcon}
                onClick={() => setSearchMode(true)}
              >
                <SearchIcon />
              </div>
            </div>
          )}
          {/* till here is header */}
          <div
            className={styles.projectsContainer}
            style={{
              height:
                window.innerWidth <= 768
                  ? window.innerHeight - 126 - top
                  : window.innerHeight - 126,
            }}
          >
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

export default ProjectsList;

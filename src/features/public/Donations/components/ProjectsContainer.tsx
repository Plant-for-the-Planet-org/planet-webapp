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
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 768;

  const featuredList = process.env.NEXT_PUBLIC_FEATURED_LIST;

  const showFeaturedList =
    featuredList === 'false' || featuredList === '0' ? false : true;

  // subtract screen height with bottom nav
  const containerHeight = screenHeight - 76;

  const [selectedTab, setSelectedTab] = React.useState('all');
  const [searchMode, setSearchMode] = React.useState(false);

  React.useEffect(() => {
    showFeaturedList ? setSelectedTab('featured') : null;
    showFeaturedList ? null : setSearchMode(true);
  }, []);

  const [searchValue, setSearchValue] = React.useState('');

  const searchRef = React.useRef(null);

  const [isScrolling, setIsScrolling] = React.useState(false);
  const [clientY, setClientY] = React.useState(!isMobile ? 60 : 0);
  const [top, setTop] = React.useState(!isMobile ? 60 : 200);
  const [allowScroll, setAllowScroll] = React.useState(!isMobile);
  const [canChangeTopValue, setCanChangeTopValue] = React.useState(true);
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

  // when touched on the project list container enables scrolling of list and
  // sets the current y-axis touch position in clientY
  function onTouchStart(e: any) {
    if (isMobile) {
      setIsScrolling(true);
      setClientY(e.touches[0].clientY);
    }
  }

  // when finger is dragged new on the list it adjusts the margin of the container accordingly
  function onTouchMove(e: any) {
    if (isScrolling) {
      let newTop = top + (e.touches[0].clientY - clientY);
      // if change of top value is allowed and the current top value is below the
      // top of the screen then replaces the state top value with current top value
      if (canChangeTopValue && newTop >= 0 && newTop <= screenHeight - 100) {
        setTop(newTop);
        setClientY(e.touches[0].clientY);
      }
      // checks if top value is less than 20px then allows the list to scroll else not
      if (top <= 30) {
        setAllowScroll(true);
      } else {
        setAllowScroll(false);
      }
    }
  }

  // when finger is removed from the surface or interupted then stops the scrolling of list
  function onTouchEnd() {
    if (isMobile) {
      setIsScrolling(false);
    }
  }

  // handles the scroll of the project list
  function handleScroll(e: any) {
    // toggles the permission for changing the top value while the list is being scrolled
    // if list is scrolled to top then then allows the value of top to be changed
    // else disallows the top value to be changed
    if (e.target.scrollTop === 0) {
      setCanChangeTopValue(true);
    } else if (e.target.scrollTop > 0 && canChangeTopValue) {
      setCanChangeTopValue(false);
    }
  }

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
      className={styles.container}
      style={{
        marginTop: top,
        height: isMobile ? containerHeight - top : containerHeight,
      }}
    >
      <div
        className={styles.cardContainer}
        ref={projectContainer}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchEnd}
        style={
          isMobile && screenWidth > 420
            ? {
                left: 'calc((100vw - 420px)/2)',
                right: 'calc((100vw - 420px)/2)',
              }
            : {}
        }
      >
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
        <div
          onScroll={handleScroll}
          className={styles.projectsContainer}
          style={{
            height:
              window.innerWidth <= 768
                ? window.innerHeight - 126 - top
                : window.innerHeight - 126,
            overflowY: allowScroll ? 'scroll' : 'hidden',
          }}
          ref={projectsContainer}
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
  );
}

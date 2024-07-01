import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import MuiButton from '../../common/InputTypes/MuiButton';
import ProjectLoader from '../../common/ContentLoaders/Projects/ProjectLoader';
import { useTranslations } from 'next-intl';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../public/assets/images/NotFound';
import Header from '../components/projects/Header';
import SearchBar from '../components/projects/SearchBar';
import { useDebouncedEffect } from '../../../utils/useDebouncedEffect';
import Explore from '../components/maps/Explore';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import { useUserProps } from '../../../../src/features/common/Layout/UserPropsContext';
import { SetState } from '../../common/types/common';
import { MapProject } from '../../common/types/ProjectPropsContextInterface';
import { getRequest } from '../../../utils/apiRequests/api';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import { Tenant } from '@planet-sdk/common';
import { useTenant } from '../../common/Layout/TenantContext';

interface Props {
  projects: MapProject[];
  showProjects: Boolean;
  setShowProjects: Function;
  setsearchedProjects: SetState<MapProject[]>;
}

const ProjectSnippet = dynamic(() => import('../components/ProjectSnippet'), {
  loading: () => <ProjectLoader />,
});

function ProjectsList({
  projects,
  showProjects,
  setsearchedProjects,
}: Props): ReactElement {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 767;
  const { embed, showProjectList } = React.useContext(ParamsContext);
  const { isImpersonationModeOn } = useUserProps();
  const isEmbed = embed === 'true';
  const [scrollY, setScrollY] = React.useState(0);
  const [hideSidebar, setHideSidebar] = React.useState(isEmbed);
  const tDonate = useTranslations('Donate');
  const tCountry = useTranslations('Country');
  const tMaps = useTranslations('Maps');
  const [selectedTab, setSelectedTab] = React.useState<'all' | 'top'>('all');
  const [searchMode, setSearchMode] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [trottledSearchValue, setTrottledSearchValue] = React.useState('');
  const [searchProjectResults, setSearchProjectResults] = React.useState<
    MapProject[] | undefined
  >();
  const [shouldSortProjectList, setShouldSortProjectList] = React.useState<
    boolean | null
  >(null);
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();

  useDebouncedEffect(
    () => {
      setTrottledSearchValue(searchValue);
    },
    1000,
    [searchValue]
  );

  const searchRef = React.useRef(null);

  function getProjects(
    projects: MapProject[],
    type: string
  ): MapProject[] | undefined {
    if (type === 'top') {
      return projects.filter(
        (project) =>
          project.properties.purpose === 'trees' &&
          project.properties.isApproved === true &&
          project.properties.isTopProject === true
      );
    } else if (type === 'all') {
      return projects;
    } else if (type === 'all_sorted') {
      const donatableProjects = projects.filter(
        (project) => project.properties.allowDonations === true
      );
      const nonDonatableProjects = projects.filter(
        (project) => project.properties.allowDonations === false
      );
      return [...donatableProjects, ...nonDonatableProjects];
    }
  }

  function getSearchProjects(projects: MapProject[], keyword: string) {
    let resultProjects = [];
    if (keyword !== '') {
      const keywords = keyword.split(/[\s\-.,+]+/);
      resultProjects = projects.filter(function (project) {
        const found = keywords.every(function (word) {
          const searchWord = word
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
          const projectName = project.properties.name
            ? project.properties.name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
            : '';
          const projectLocation =
            project.properties.purpose === 'trees' &&
            project.properties.location
              ? project.properties.location
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase()
              : '';
          const projectTpoName = project.properties.tpo.name
            ? project.properties.tpo.name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
            : '';
          const projectCountry = project.properties.country
            ? tCountry(project.properties.country.toLowerCase())
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
            : '';
          //searching for name
          return (
            projectName.indexOf(searchWord) > -1 ||
            //searching for location
            (projectLocation && projectLocation.indexOf(searchWord) > -1) ||
            //searching for tpo name
            (projectTpoName && projectTpoName.indexOf(searchWord) > -1) ||
            //searching for country name
            (projectCountry && projectCountry.indexOf(searchWord) > -1)
          );
        });
        return found;
      });
      setsearchedProjects(resultProjects);
      return resultProjects;
    } else {
      setsearchedProjects(projects);
    }
  }

  const allProjects = React.useMemo(() => {
    if (shouldSortProjectList !== null) {
      if (!shouldSortProjectList) {
        return getProjects(projects, 'all_sorted');
      } else {
        return getProjects(projects, 'all');
      }
    }
  }, [projects, shouldSortProjectList]);

  React.useEffect(() => {
    const _searchProjectResults = getSearchProjects(
      projects,
      trottledSearchValue
    );
    setSearchProjectResults(_searchProjectResults);
  }, [trottledSearchValue, projects]);

  React.useEffect(() => {
    async function setListOrder() {
      try {
        const res = await getRequest<Tenant>(
          tenantConfig.id,
          `/app/tenants/${tenantConfig.id}`
        );
        setShouldSortProjectList(res.topProjectsOnly);
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    setListOrder();
  }, []);

  const topProjects = React.useMemo(
    () => getProjects(projects, 'top'),
    [projects]
  );

  const showTopProjectsList =
    tenantConfig.config.slug !== 'salesforce' &&
    topProjects !== undefined &&
    topProjects.length > 0;

  React.useEffect(() => {
    showTopProjectsList ? setSelectedTab('top') : null;
  }, []);

  const NoProjectFound = () => {
    return (
      <div className={'projectNotFound'}>
        <LazyLoad>
          <NotFound className={'projectNotFoundImage'} />
          <h5 style={{ color: 'var(--primary-font-color' }}>
            {tDonate('noProjectsFound')}
          </h5>
        </LazyLoad>
      </div>
    );
  };

  const toggleSidebar = () => {
    setHideSidebar(!hideSidebar);
  };

  return (
    <>
      <Explore />
      {isEmbed && isMobile && showProjectList === undefined && (
        <MuiButton
          onClick={toggleSidebar}
          variant={hideSidebar ? 'outlined' : 'contained'}
          className="toggleButton"
        >
          {hideSidebar ? tMaps('showProjectList') : tMaps('hideProjectList')}
        </MuiButton>
      )}
      {showProjects ? (
        <div
          style={{ transform: `translate(0,${scrollY}px)` }}
          className={isEmbed ? 'embedContainer' : 'container'}
          onTouchMove={(event) => {
            if (isMobile) {
              if (event.targetTouches[0].clientY < (screenHeight * 2) / 8) {
                setScrollY(event.targetTouches[0].clientY);
              } else {
                setScrollY((screenHeight * 2) / 9);
              }
            }
          }}
        >
          {!(isEmbed && showProjectList === 'false') && (
            <div
              className={`sidebar ${
                isMobile && hideSidebar && showProjectList !== 'true'
                  ? 'mobile-hidden'
                  : ''
              } ${isImpersonationModeOn ? `impersonationTop` : ''}`}
            >
              <div className={`header ${isMobile ? 'header--mobile' : ''}`}>
                {isMobile && (!hideSidebar || showProjectList === 'true') && (
                  <div className={'dragBar'}></div>
                )}
                {searchMode ? (
                  <SearchBar
                    setSearchValue={setSearchValue}
                    setSearchMode={setSearchMode}
                    searchValue={searchValue}
                    searchRef={searchRef}
                  />
                ) : (
                  <Header
                    showTopProjectsList={showTopProjectsList}
                    setSelectedTab={setSelectedTab}
                    selectedTab={selectedTab}
                    setSearchMode={setSearchMode}
                    projects={projects}
                  />
                )}
              </div>
              {/* till here is header */}
              <div className={'projectsContainer'}>
                {trottledSearchValue !== '' ? (
                  searchProjectResults && searchProjectResults.length > 0 ? (
                    searchProjectResults.map((project) => (
                      <ProjectSnippet
                        key={project.properties.id}
                        project={project.properties}
                        editMode={false}
                        displayPopup={true}
                      />
                    ))
                  ) : (
                    <NoProjectFound />
                  )
                ) : selectedTab === 'all' ? (
                  allProjects && allProjects.length > 0 ? (
                    allProjects.map((project) => (
                      <ProjectSnippet
                        key={project.properties.id}
                        project={project.properties}
                        editMode={false}
                        displayPopup={true}
                      />
                    ))
                  ) : (
                    <NoProjectFound />
                  )
                ) : topProjects && topProjects.length > 0 ? (
                  topProjects.map((project) => (
                    <ProjectSnippet
                      key={project.properties.id}
                      project={project.properties}
                      editMode={false}
                      displayPopup={true}
                    />
                  ))
                ) : (
                  <NoProjectFound />
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}

export default ProjectsList;

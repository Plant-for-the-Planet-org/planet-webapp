import { useCallback, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ProjectSnippet from './ProjectSnippet';
import style from './ProjectsSection.module.scss';
import { useProjects } from './ProjectsContext';
import ProjectListControls from './ProjectListControls';
import { MapProject } from '../common/types/ProjectPropsContextInterface';
import ProjectListControlForMobile from './ProjectListControls/ProjectListControlForMobile';
import { getSearchProjects } from './ProjectListControls/utils';

const ProjectsSection = () => {
  const {
    projects,
    topFilteredProjects,
    setTopFilteredProjects,
    regularFilterProjects,
    setRegularFilterProjects,
    selectedClassification,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
    searchProjectResults,
    setSearchProjectResults,
    isLoading,
    isError,
    isMobile,
    tabSelected,
    setTabSelected,
    topProjects,
  } = useProjects();
  const [isSearching, setIsSearching] = useState(false);
  // Determine which projects to display
  const projectsToDisplay = useMemo(() => {
    if (searchProjectResults && isSearching && debouncedSearchValue) {
      return searchProjectResults;
    }
    if (selectedClassification.length > 0) {
      return tabSelected === 0 ? topFilteredProjects : regularFilterProjects;
    }
    return tabSelected === 0 ? topProjects : projects;
  }, [
    tabSelected,
    selectedClassification,
    topFilteredProjects,
    topProjects,
    regularFilterProjects,
    searchProjectResults,
    debouncedSearchValue,
    isSearching,
  ]);

  console.log(searchProjectResults, '==1');
  // Function to filter projects based on classification
  const filterProjectsByClassification = useCallback(
    (projects: MapProject[]) => {
      if (selectedClassification.length === 0) return projects;
      return projects.filter((project) => {
        if (project.properties.purpose === 'trees')
          return selectedClassification.includes(
            project.properties.classification
          );
      });
    },
    [selectedClassification]
  );
  useEffect(() => {
    if (topProjects && projects) {
      setTopFilteredProjects(filterProjectsByClassification(topProjects));
      setRegularFilterProjects(filterProjectsByClassification(projects));
    }
  }, [tabSelected, selectedClassification]);

  useEffect(() => {
    const searchResult = getSearchProjects(projects, debouncedSearchValue);
    if (searchResult) setSearchProjectResults(searchResult);
  }, [debouncedSearchValue]);

  const renderProjectSnippet = useCallback(
    (project: MapProject) => (
      <ProjectSnippet
        key={project.properties.id}
        project={project.properties}
        showPopup={true}
      />
    ),
    []
  );

  if (isLoading || isError) {
    return <Skeleton className={style.projectSectionSkeleton} />;
  }
  const projectCount = selectedClassification.length
    ? regularFilterProjects?.length
    : projects?.length;

  const topProjectCount = selectedClassification.length
    ? topFilteredProjects?.length
    : topProjects?.length;

  return (
    <>
      {isMobile ? (
        <ProjectListControlForMobile
          projectCount={projectCount}
          topProjectCount={topProjectCount}
        />
      ) : (
        <ProjectListControls
          projectCount={projectCount}
          topProjectCount={topProjectCount}
          setTabSelected={setTabSelected}
          tabSelected={tabSelected}
          setSelectedClassification={setSelectedClassification}
          selectedClassification={selectedClassification}
          setDebouncedSearchValue={setDebouncedSearchValue}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
        />
      )}

      <div className={style.projectList}>
        {projectsToDisplay?.map(renderProjectSnippet)}
      </div>
    </>
  );
};

export default ProjectsSection;

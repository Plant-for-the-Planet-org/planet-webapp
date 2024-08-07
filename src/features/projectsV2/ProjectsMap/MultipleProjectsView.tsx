import { useMemo } from 'react';
import { useProjects } from '../ProjectsContext';
import ProjectMarkers, { CategorizedProjects } from './ProjectMarkers';
import { getProjectCategory } from './utils';

const MultipleProjectsView = ({
  selectedMode,
  isMobile,
}: {
  selectedMode: 'list' | 'map';
  isMobile: boolean;
}) => {
  const {
    projects,
    filteredTopProjects,
    filteredRegularProjects,
    isLoading,
    isError,
    selectedClassification,
    tabSelected,
    topProjects,
    searchProjectResults,
    debouncedSearchValue,
  } = useProjects();

  if (isLoading || isError || !projects) {
    return null;
  }
  const projectsToDisplay = useMemo(() => {
    //* If search results exist, return them (search project case)
    if (searchProjectResults && searchProjectResults?.length > 0) {
      return searchProjectResults;
    }
    //* If there are no search results and the search value is not empty, return an empty array (no project found case)
    if (searchProjectResults?.length === 0 && debouncedSearchValue.length > 0)
      return [];
    //* If a classification filter is applied, return the filtered projects based on the selected tab
    if (selectedClassification.length > 0) {
      return tabSelected === 0 || tabSelected === 'topProjects'
        ? filteredTopProjects
        : filteredRegularProjects;
    }
    //* If none of the above conditions are met, return all projects (for desktop version).
    //* However it return all projects base on selected tab(top/all) for mobile version
    return isMobile
      ? tabSelected === 'topProjects'
        ? topProjects
        : projects
      : projects;
  }, [
    selectedMode,
    tabSelected,
    selectedClassification,
    filteredTopProjects,
    topProjects,
    filteredRegularProjects,
    searchProjectResults,
  ]);

  const categorizedProjects = useMemo(() => {
    return projectsToDisplay?.reduce<CategorizedProjects>(
      (categorizedProjects, project) => {
        const projectCategory = getProjectCategory(project.properties);
        switch (projectCategory) {
          case 'topProject':
            categorizedProjects.topApprovedProjects.push(project);
            break;
          case 'regularProject':
            categorizedProjects.regularDonatableProjects.push(project);
            break;
          case 'nonDonatableProject':
            categorizedProjects.nonDonatableProjects.push(project);
            break;
        }
        return categorizedProjects;
      },
      {
        topApprovedProjects: [],
        nonDonatableProjects: [],
        regularDonatableProjects: [],
      }
    );
  }, [
    projects,
    filteredTopProjects,
    filteredRegularProjects,
    searchProjectResults,
    isLoading,
    isError,
  ]);
  return (
    <ProjectMarkers
      categorizedProjects={categorizedProjects}
      selectedClassification={selectedClassification}
    />
  );
};

export default MultipleProjectsView;

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
    doSearchResultsMatchFilters,
  } = useProjects();

  if (isLoading || isError || !projects) {
    return null;
  }
  const projectsToDisplay = useMemo(() => {
    const isTopProjectTab = tabSelected === 0 || tabSelected === 'topProjects';
    const hasClassificationFilter = selectedClassification.length > 0;
    if (searchProjectResults && debouncedSearchValue) {
      if (hasClassificationFilter && doSearchResultsMatchFilters) {
        return searchProjectResults;
      } else if (hasClassificationFilter && !doSearchResultsMatchFilters) {
        return [];
      } else {
        return searchProjectResults;
      }
    }

    if (searchProjectResults?.length === 0 && debouncedSearchValue.length > 0)
      return [];

    if (hasClassificationFilter) {
      return isTopProjectTab ? filteredTopProjects : filteredRegularProjects;
    }
    //* If none of the above conditions are met, return all projects (for desktop version).
    //* However it return all projects base on selected tab(top/all) for mobile version
    return isMobile ? (isTopProjectTab ? topProjects : projects) : projects;
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

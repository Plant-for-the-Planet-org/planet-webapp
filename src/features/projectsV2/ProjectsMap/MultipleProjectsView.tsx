import { useMemo } from 'react';
import { useProjects } from '../ProjectsContext';
import ProjectMarkers, { CategorizedProjects } from './ProjectMarkers';
import { getProjectCategory } from './utils';

const MultipleProjectsView = () => {
  const {
    projects,
    topFilteredProjects,
    regularFilterProjects,
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
    if (searchProjectResults && searchProjectResults?.length > 0) {
      return searchProjectResults;
    }
    if (selectedClassification.length > 0) {
      return tabSelected === 0 ? topFilteredProjects : regularFilterProjects;
    }
    return projects;
  }, [
    tabSelected,
    selectedClassification,
    topFilteredProjects,
    topProjects,
    regularFilterProjects,
    searchProjectResults,
    debouncedSearchValue,
  ]);
  console.log(searchProjectResults, '==1');
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
    topFilteredProjects,
    regularFilterProjects,
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

import React, { ReactElement } from 'react';

interface Props {}

export const ProjectPropsContext = React.createContext({
  projects: [] || null,
  project: {} || null,
  setProject: (value: {}) => {},
  setProjects: (value: []) => {},
  showSingleProject: false,
  setShowSingleProject: (value: boolean) => {},
  showProjects: true,
  setShowProjects: (value: boolean) => {},
  searchedProject: [],
  setsearchedProjects: (value: []) => {},
});

function ProjectPropsProvider({ children }: any): ReactElement {
  const [projects, setProjects] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [showProjects, setShowProjects] = React.useState(true);
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [searchedProject, setsearchedProjects] = React.useState([]);

  return (
    <ProjectPropsContext.Provider
      value={{
        projects,
        project,
        setProject,
        setProjects,
        showSingleProject,
        setShowSingleProject,
        showProjects,
        setShowProjects,
        searchedProject,
        setsearchedProjects,
      }}
    >
      {children}
    </ProjectPropsContext.Provider>
  );
}

export default ProjectPropsProvider;

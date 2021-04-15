import React, { ReactElement } from 'react';

interface Props {}

export const MapPropsContext = React.createContext({
  projects: [],
  project: {},
  setProject: (value: {}) => {},
  setProjects: (value: []) => {},
  showSingleProject: false,
  setShowSingleProject: (value: boolean) => {},
  showProjects: true,
  setShowProjects: (value: boolean) => {},
  searchedProject: [],
  setsearchedProjects: (value: []) => {},
});

function MapPropsProvider({ children }: any): ReactElement {
  const [projects, setProjects] = React.useState([]);
  const [project, setProject] = React.useState({});
  const [showProjects, setShowProjects] = React.useState(true);
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [searchedProject, setsearchedProjects] = React.useState([]);

  return (
    <MapPropsContext.Provider
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
    </MapPropsContext.Provider>
  );
}

export default MapPropsProvider;

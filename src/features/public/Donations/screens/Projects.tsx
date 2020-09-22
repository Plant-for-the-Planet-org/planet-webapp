import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import ProjectsContainer from '../components/ProjectsContainer';
import SingleProjectDetails from '../components/SingleProjectDetails';
import styles from '../styles/Projects.module.scss';

const MapLoader = () => (
  <div
    style={{ minHeight: '100vh', backgroundColor: '#c8def4', width: '100%' }}
  >
    <img
      src={`https://api.mapbox.com/styles/v1/sagararl/ckdfyrsw80y3a1il9eqpecoc7/static/-28.5,36.96,1.4/1200x800?access_token=${process.env.MAPBOXGL_ACCESS_TOKEN}`}
      height="100%"
      width="100%"
    />
  </div>
);

const MapLayout = dynamic(() => import('../components/MapboxMap'), {
  ssr: false,
  loading: () => <MapLoader />,
});

interface Props {
  projects: any;
  project: any;
  showSingleProject: any;
}

function ProjectsList({
  projects,
  project,
  showSingleProject,
}: Props): ReactElement {
  const [searchedProjects, setSearchedProjects] = React.useState([]);
  const [allProjects, setAllProjects] = React.useState(projects);
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 767;
  const [scrollY, setScrollY] = React.useState(0);
  React.useEffect(() => {
    if (searchedProjects === null || searchedProjects.length < 1)
      setAllProjects(projects);
    else setAllProjects(searchedProjects);
  }, [projects, searchedProjects]);

  const ProjectsProps = {
    projects: allProjects,
    project,
    showSingleProject,
    setSearchedProjects: setSearchedProjects,
  };

  return (
    <>
      <MapLayout
        {...ProjectsProps}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />
      {/* Add Condition Operator */}

      {showSingleProject ? (
        <SingleProjectDetails project={project} />
      ) : (
        <div
          style={{ transform: `translate(0,${scrollY}px)` }}
          className={styles.container}
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
          <ProjectsContainer {...ProjectsProps} />
        </div>
      )}
    </>
  );
}

export default ProjectsList;

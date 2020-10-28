import React, { ReactElement } from 'react';
import ProjectsContainer from '../components/ProjectsContainer';
import styles from '../styles/Projects.module.scss';

interface Props {
  projects: any;
  directGift: any;
  setDirectGift: Function;
  showProjects: Boolean;
  setShowProjects: Function;
}

function ProjectsList({
  projects,
  directGift,
  setDirectGift,
  showProjects,
  setShowProjects,
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
    setSearchedProjects: setSearchedProjects,
    directGift,
    setDirectGift,
    setShowProjects,
  };

  return (
    <>
      {showProjects ? (
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
      ) : null}
    </>
  );
}

export default ProjectsList;

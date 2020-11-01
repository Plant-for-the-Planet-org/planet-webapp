import React, { ReactElement } from 'react';
import ProjectsContainer from '../components/ProjectsContainer';
import styles from '../styles/Projects.module.scss';

interface Props {
  projects: any;
  directGift: any;
  setDirectGift: Function;
  setsearchedProjects: any
}

function ProjectsList({
  projects,
  directGift,
  setDirectGift,
  setsearchedProjects,
}: Props): ReactElement {
  const [searchedProjects, setSearchedProjects] = React.useState([]);
  const [allProjects, setAllProjects] = React.useState(projects);
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 767;
  const [scrollY, setScrollY] = React.useState(0);

  const ProjectsProps = {
    projects,
    setSearchedProjects: setsearchedProjects,
    directGift,
    setDirectGift,
  };

  return (
    <>
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
    </>
  );
}

export default ProjectsList;

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import ProjectsContainer from '../components/ProjectsContainer';
import SingleProjectDetails from '../components/SingleProjectDetails';
import styles from '../styles/Projects.module.scss';

const MapLayout = dynamic(() => import('./MapboxMap'), {
  ssr: false,
  loading: () => <p></p>,
});

interface Props {
  projects: any;
  projectsContainer: any;
}

function ProjectsList({ projects, projectsContainer }: Props): ReactElement {
  const router = useRouter();
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [project, setProject] = React.useState(null);
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
    project: project,
    showSingleProject,
    fetchSingleProject: fetchSingleProject,
    setSearchedProjects: setSearchedProjects,
    projectsContainer,
  };

  async function fetchSingleProject(id: any) {
    let currencyCode;
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('currencyCode')) {
        currencyCode = localStorage.getItem('currencyCode');
        // currencyCode = 'EUR';
      } else {
        currencyCode = 'USD';
      }
    }
    const res = await fetch(
      `${process.env.API_ENDPOINT}/app/projects/${id}?_scope=extended&currency=${currencyCode}`,
      {
        headers: { 'tenant-key': `${process.env.TENANTID}` },
      }
    );

    const newProject = res.status === 200 ? await res.json() : null;
    setProject(newProject);
  }

  React.useEffect(() => {
    if (router.query.p) {
      fetchProject(router.query.p).then(() => {});
    }
  }, []);

  React.useEffect(() => {
    if (router.query.p === undefined) {
      setShowSingleProject(false),
        router.push('/', undefined, { shallow: true });
    }
  }, [router.query.p]);

  React.useEffect(() => {
    if (project !== null) {
      setShowSingleProject(true);
    }
  }, [project]);

  async function fetchProject(id: any) {
    await fetchSingleProject(id);
  }

  const [selectedId, setSelectedId] = React.useState(null);

  return (
    <>
      <MapLayout
        {...ProjectsProps}
        fetchSingleProject={fetchSingleProject}
        setShowSingleProject={setShowSingleProject}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />
      {/* Add Condition Operator */}

      {showSingleProject ? (
        <SingleProjectDetails
          project={project}
          setShowSingleProject={setShowSingleProject}
          setLayoutId={() => setSelectedId}
        />
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
          <ProjectsContainer
            {...ProjectsProps}
            setLayoutId={() => setSelectedId}
            setShowSingleProject={setShowSingleProject}
          />
        </div>
      )}
    </>
  );
}

export default ProjectsList;

import { AnimateSharedLayout, motion } from 'framer-motion';
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
  yScroll: any;
  projectsContainer: any;
}

function ProjectsList({
  projects,
  yScroll,
  projectsContainer,
}: Props): ReactElement {
  const router = useRouter();
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const [site, setSite] = React.useState(null);
  const [touchMap, setTouchMap] = React.useState(false);

  const [searchedProjects, setSearchedProjects] = React.useState([]);
  const [allProjects, setAllProjects] = React.useState(projects);
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
    yScroll: yScroll,
    setSearchedProjects: setSearchedProjects,
    touchMap,
    setTouchMap,
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
      {/* <div className={styles.mainContainer}> */}
      {/* {!touchMap ? (
        <div
          className={styles.openMap}
          onClick={() => {
            setTouchMap(true);
          }}
        >
          <MapIcon color="#fff" /> Map
        </div>
      ) : null} */}
      {/* Add Condition Operator */}

      {showSingleProject ? (
        <SingleProjectDetails
          project={project}
          setShowSingleProject={setShowSingleProject}
          setLayoutId={() => setSelectedId}
          touchMap={touchMap}
          setTouchMap={setTouchMap}
        />
      ) : (
        <AnimateSharedLayout type="crossfade">
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{ duration: 1 }}
            ref={projectsContainer}
            // style={
            //   touchMap
            //     ? { top: '70vh', overflow: 'hidden', transition: 'ease 0.5s' }
            //     : { top: 0, overflowY: 'scroll', transition: 'ease 0.5s' }
            // }
            className={styles.container}
          >
            <ProjectsContainer
              {...ProjectsProps}
              setLayoutId={() => setSelectedId}
              setShowSingleProject={setShowSingleProject}
            />
          </motion.div>
        </AnimateSharedLayout>
      )}
      <MapLayout
        {...ProjectsProps}
        fetchSingleProject={fetchSingleProject}
        setShowSingleProject={setShowSingleProject}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />
      {/* </div> */}
    </>
  );
}

export default ProjectsList;

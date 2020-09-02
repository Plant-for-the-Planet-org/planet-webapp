import { AnimateSharedLayout, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import ProjectsContainer from '../components/ProjectsContainer';
import SingleProjectDetails from '../components/SingleProjectDetails';

const MapLayout = dynamic(() => import('./MapboxMap'), {
  ssr: false,
  loading: () => <p></p>,
});

interface Props {
  projects: any;
}

function ProjectsList({ projects }: Props): ReactElement {
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const ProjectsProps = {
    projects: projects,
    project: project,
    showSingleProject,
    fetchSingleProject: fetchSingleProject,
  };

  async function fetchSingleProject(id: any) {
    let currencyCode;
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('currencyCode')) {
        currencyCode = localStorage.getItem('currencyCode');
        // currencyCode = 'EUR';
      } else {
        currencyCode = 'EUR';
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

  // For animation

  const [selectedId, setSelectedId] = React.useState(null);

  return (
    <div>
      <MapLayout
        {...ProjectsProps}
        fetchSingleProject={fetchSingleProject}
        setShowSingleProject={setShowSingleProject}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />

      {/* Add Condition Operator */}
      <AnimateSharedLayout type="crossfade">
        {showSingleProject ? (
          <SingleProjectDetails
            project={project}
            setShowSingleProject={setShowSingleProject}
            setLayoutId={() => setSelectedId}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{ duration: 1 }}
          >
            <ProjectsContainer
              {...ProjectsProps}
              setLayoutId={() => setSelectedId}
              setShowSingleProject={setShowSingleProject}
            />
          </motion.div>
        )}
      </AnimateSharedLayout>
    </div>
  );
}

export default ProjectsList;

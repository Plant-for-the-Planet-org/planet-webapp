import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../assets/images/NotFound';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import styles from './../styles/AllProjects.module.scss';

const ProjectSnippet = dynamic(() => import('./ProjectSnippet'), {
  loading: () => <ProjectLoader />,
});
interface Props {
  projects: any;
  setShowSingleProject: Function;
  fetchSingleProject: Function;
}

function AllProjects({
  projects,
  setShowSingleProject,
  fetchSingleProject,
}: Props): ReactElement {
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        when: 'beforeChildren',
        staggerChildren: 1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (projects.length < 1) {
    return (
      <div className={styles.projectNotFound}>
        <LazyLoad>
          <NotFound className={styles.projectNotFoundImage} />
          <h5>No projects found</h5>
        </LazyLoad>
      </div>
    );
  } else {
    return (
      <div className={styles.allProjectsContainer}>
        <LazyLoad>
          <motion.div variants={container} initial="hidden" animate="visible">
            {projects.map((project: any) => {
              return (
                <motion.div variants={item} key={project.properties.id}>
                  <ProjectSnippet
                    key={project.properties.id}
                    project={project}
                    setShowSingleProject={setShowSingleProject}
                    fetchProject={async () => {
                      await fetchSingleProject(project.properties.id);
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </LazyLoad>
      </div>
    );
  }
}

export default AllProjects;

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../assets/images/NotFound';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import styles from '../styles/ProjectsContainer.module.scss';

const ProjectSnippet = dynamic(() => import('./ProjectSnippet'), {
  loading: () => <ProjectLoader />,
});

export default function ProjectsContainer({ projects }: any) {
  const dummyFunc1 = () => {
    console.log('dummy func');
  };

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
  return (
    <div className={styles.outerProjectsContainer}>
      <h6 className={styles.projectsTitleText}> PROJECTS </h6>

      {projects.length < 1 ? (
        <div className={styles.projectNotFound}>
          <LazyLoad>
            <NotFound className={styles.projectNotFoundImage} />
            <h5>No projects found</h5>
          </LazyLoad>
        </div>
      ) : (
        <LazyLoad>
          <motion.div
            className={styles.listProjects}
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project: any) => {
              return (
                <motion.div
                  className={styles.singleProject}
                  variants={item}
                  layoutId={project.id}
                  key={project.id}
                >
                  <ProjectSnippet
                    key={project.id}
                    project={project}
                    setShowSingleProject={dummyFunc1}
                    setLayoutId={dummyFunc1}
                    fetchProject={dummyFunc1}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </LazyLoad>
      )}
    </div>
  );
}

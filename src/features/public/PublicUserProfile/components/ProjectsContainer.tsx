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
  return (
    <div style={{ margin: 'auto', maxWidth: '950px' }}>
      {projects.length < 1 ? (
        <div className={styles.projectNotFound}>
          <LazyLoad>
            <NotFound className={styles.projectNotFoundImage} />
            <h5>No projects found</h5>
          </LazyLoad>
        </div>
      ) : (
        <div className={styles.listProjects}>
          <h6 className={styles.projectsTitleText}> PROJECTS </h6>

          {projects.map((project: any) => {
            return (
              <div className={styles.singleProject} key={project.id}>
                <ProjectSnippet key={project.id} project={project} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

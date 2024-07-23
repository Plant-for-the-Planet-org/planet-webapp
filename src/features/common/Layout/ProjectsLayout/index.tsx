import { FC } from 'react';
import styles from './ProjectsLayout.module.scss';
import Credits from '../../../projects/components/maps/Credits';
import { SetState } from '../../types/common';
import ProjectsMap from './ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';

interface ProjectsLayoutProps {
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  page: 'project-list' | 'project-details';
}

const ProjectsLayout: FC<ProjectsLayoutProps> = ({
  children,
  currencyCode,
  setCurrencyCode,
  page,
}) => {
  return (
    <ProjectsProvider
      page={page}
      currencyCode={currencyCode}
      setCurrencyCode={setCurrencyCode}
    >
      <div className={styles.projectsLayout}>
        <main className={styles.mainContent}>
          <section className={styles.contentContainer}>{children}</section>
          <section className={styles.mapContainer}>
            <ProjectsMap />
          </section>
        </main>
        <Credits setCurrencyCode={setCurrencyCode} />
      </div>
    </ProjectsProvider>
  );
};

export default ProjectsLayout;

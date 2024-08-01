import { FC } from 'react';
import styles from './ProjectsLayout.module.scss';
import Credits from '../../../projects/components/maps/Credits';
import { SetState } from '../../types/common';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import {
  ProjectsMapProvider,
  useProjectsMap,
} from '../../../projectsV2/ProjectsMapContext';
import MapFeatureExplorer from '../../../projectsV2/ProjectsMap/MapFeatureExplorer';

interface ProjectsLayoutProps {
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  page: 'project-list' | 'project-details';
}

const ProjectsLayoutContent: FC<Omit<ProjectsLayoutProps, 'currencyCode'>> = ({
  children,
  setCurrencyCode,
  page,
}) => {
  const { mapOptions } = useProjectsMap();
  const showContentContainer =
    mapOptions.showProjects || page === 'project-details';

  return (
    <div className={styles.projectsLayout}>
      <main className={styles.mainContent}>
        {showContentContainer && (
          <section className={styles.contentContainer}>{children}</section>
        )}
        <section className={styles.mapContainer}>
          {page === 'project-list' && (
            <div className={styles.mapFeatureExplorer}>
              <MapFeatureExplorer />
            </div>
          )}
          <ProjectsMap />
        </section>
      </main>
      <Credits setCurrencyCode={setCurrencyCode} />
    </div>
  );
};

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
      <ProjectsMapProvider>
        <ProjectsLayoutContent setCurrencyCode={setCurrencyCode} page={page}>
          {children}
        </ProjectsLayoutContent>
      </ProjectsMapProvider>
    </ProjectsProvider>
  );
};

export default ProjectsLayout;

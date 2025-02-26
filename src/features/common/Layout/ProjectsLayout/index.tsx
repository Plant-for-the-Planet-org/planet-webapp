import type { FC } from 'react';
import type { SetState } from '../../types/common';

import { useMemo } from 'react';
import styles from './ProjectsLayout.module.scss';
import Credits from '../../../projectsV2/ProjectsMap/Credits';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import {
  ProjectsMapProvider,
  useProjectsMap,
} from '../../../projectsV2/ProjectsMapContext';
import MapFeatureExplorer from '../../../projectsV2/ProjectsMap/MapFeatureExplorer';
import { useRouter } from 'next/router';
import { useUserProps } from '../UserPropsContext';

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
  const { mapOptions, updateMapOption } = useProjectsMap();
  const { query } = useRouter();
  const { isImpersonationModeOn } = useUserProps();
  const showContentContainer =
    Boolean(mapOptions.projects) || page === 'project-details';
  const layoutClass = useMemo(() => {
    if (query.embed === 'true') return styles.embedMode;
    if (isImpersonationModeOn) return styles.impersonationMode;
    return styles.projectsLayout;
  }, [isImpersonationModeOn, query.embed]);
  return (
    <div className={layoutClass}>
      <main className={styles.mainContent}>
        {showContentContainer && (
          <section className={styles.contentContainer}>{children}</section>
        )}
        <section className={styles.mapContainer}>
          {page === 'project-list' && (
            <div className={styles.mapFeatureExplorerOverlay}>
              <MapFeatureExplorer
                mapOptions={mapOptions}
                updateMapOption={updateMapOption}
              />
            </div>
          )}
          <ProjectsMap isMobile={false} page={page} />
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

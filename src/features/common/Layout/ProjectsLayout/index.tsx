import type { ReactNode } from 'react';
import type { SetState } from '../../types/common';

import { useMemo } from 'react';
import styles from './ProjectsLayout.module.scss';
import Credits from '../../../projectsV2/ProjectsMap/Credits';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import MapFeatureExplorer from '../../../projectsV2/ProjectsMap/MapFeatureExplorer';
import {
  useProjectMapStore,
  useQueryParamStore,
  useUserStore,
} from '../../../../stores';

interface ProjectsLayoutProps {
  children: ReactNode;
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  page: 'project-list' | 'project-details';
}

const ProjectsLayoutContent = ({
  children,
  setCurrencyCode,
  page,
}: Omit<ProjectsLayoutProps, 'currencyCode'>) => {
  // store: state
  const embed = useQueryParamStore((state) => state.embed);
  const showProjectDetails = useQueryParamStore(
    (state) => state.showProjectDetails
  );
  const showProjectList = useQueryParamStore((state) => state.showProjectList);
  const mapOptions = useProjectMapStore((state) => state.mapOptions);
  const isImpersonationModeOn = useUserStore(
    (state) => state.isImpersonationModeOn
  );
  // store: action
  const updateMapOption = useProjectMapStore((state) => state.updateMapOption);

  const showContentContainer = useMemo(() => {
    if (page === 'project-list') {
      return (
        (embed !== 'true' || showProjectList !== 'false') &&
        Boolean(mapOptions.projects)
      );
    }

    if (page === 'project-details') {
      return embed !== 'true' || showProjectDetails !== 'false';
    }

    return false;
  }, [page, embed, showProjectList, showProjectDetails, mapOptions.projects]);

  const layoutClass = useMemo(() => {
    if (embed === 'true') return styles.embedMode;
    if (isImpersonationModeOn) return styles.impersonationMode;
    return styles.projectsLayout;
  }, [isImpersonationModeOn, embed]);

  const shouldShowMapFeatureExplorer = useMemo(() => {
    return page === 'project-list' && process.env.ENABLE_EXPLORE === 'true';
  }, [page, process.env.ENABLE_EXPLORE]);

  return (
    <div className={layoutClass}>
      <main className={styles.mainContent}>
        {showContentContainer && (
          <section className={styles.contentContainer}>{children}</section>
        )}
        <section className={styles.mapContainer}>
          {shouldShowMapFeatureExplorer && (
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

const ProjectsLayout = ({
  children,
  currencyCode,
  setCurrencyCode,
  page,
}: ProjectsLayoutProps) => {
  return (
    <ProjectsProvider
      page={page}
      currencyCode={currencyCode}
      setCurrencyCode={setCurrencyCode}
    >
      <ProjectsLayoutContent setCurrencyCode={setCurrencyCode} page={page}>
        {children}
      </ProjectsLayoutContent>
    </ProjectsProvider>
  );
};

export default ProjectsLayout;

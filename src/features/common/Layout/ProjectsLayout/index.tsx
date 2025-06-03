import type { FC } from 'react';
import type { SetState } from '../../types/common';

import { useContext, useMemo } from 'react';
import styles from './ProjectsLayout.module.scss';
import Credits from '../../../projectsV2/ProjectsMap/Credits';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import {
  ProjectsMapProvider,
  useProjectsMap,
} from '../../../projectsV2/ProjectsMapContext';
import MapFeatureExplorer from '../../../projectsV2/ProjectsMap/MapFeatureExplorer';
import { useUserProps } from '../UserPropsContext';
import { ParamsContext } from '../QueryParamsContext';

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
  const { isImpersonationModeOn } = useUserProps();
  const { embed, showProjectDetails, showProjectList } =
    useContext(ParamsContext);

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

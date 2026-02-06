import type { ReactNode } from 'react';

import { useMemo } from 'react';
import styles from './ProjectsLayout.module.scss';
import Credits from '../../../projectsV2/ProjectsMap/Credits';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import MapFeatureExplorer from '../../../projectsV2/ProjectsMap/MapFeatureExplorer';
import { useUserProps } from '../UserPropsContext';
import { useQueryParamStore } from '../../../../stores/queryParamStore';
import { useProjectMapStore } from '../../../../stores/projectMapStore';
import { useViewStore } from '../../../../stores';

interface ProjectsLayoutProps {
  children: ReactNode;
}

const ProjectsLayoutContent = ({ children }: ProjectsLayoutProps) => {
  // store: state
  const embed = useQueryParamStore((state) => state.embed);
  const showProjectDetails = useQueryParamStore(
    (state) => state.showProjectDetails
  );
  const showProjectList = useQueryParamStore((state) => state.showProjectList);
  const mapOptions = useProjectMapStore((state) => state.mapOptions);
  const currentPage = useViewStore((state) => state.page);
  // store: action
  const updateMapOption = useProjectMapStore((state) => state.updateMapOption);

  const { isImpersonationModeOn } = useUserProps();

  const showContentContainer = useMemo(() => {
    if (currentPage === 'project-list') {
      return (
        (embed !== 'true' || showProjectList !== 'false') &&
        Boolean(mapOptions.projects)
      );
    }

    if (currentPage === 'project-details') {
      return embed !== 'true' || showProjectDetails !== 'false';
    }

    return false;
  }, [
    currentPage,
    embed,
    showProjectList,
    showProjectDetails,
    mapOptions.projects,
  ]);

  const layoutClass = useMemo(() => {
    if (embed === 'true') return styles.embedMode;
    if (isImpersonationModeOn) return styles.impersonationMode;
    return styles.projectsLayout;
  }, [isImpersonationModeOn, embed]);

  const shouldShowMapFeatureExplorer = useMemo(() => {
    return (
      currentPage === 'project-list' && process.env.ENABLE_EXPLORE === 'true'
    );
  }, [currentPage, process.env.ENABLE_EXPLORE]);

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
          <ProjectsMap isMobile={false} />
        </section>
      </main>
      <Credits />
    </div>
  );
};

const ProjectsLayout = ({ children }: ProjectsLayoutProps) => {
  return <ProjectsLayoutContent>{children}</ProjectsLayoutContent>;
};

export default ProjectsLayout;

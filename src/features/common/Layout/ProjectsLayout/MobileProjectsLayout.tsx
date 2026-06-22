import type { ReactNode } from 'react';

import { useEffect, useState } from 'react';
import styles from './ProjectsLayout.module.scss';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import Credits from '../../../projectsV2/ProjectsMap/Credits';
import { useUserProps } from '../UserPropsContext';
import { clsx } from 'clsx';
import { useQueryParamStore } from '../../../../stores/queryParamStore';

export type ViewMode = 'list' | 'map';
interface ProjectsLayoutProps {
  children: ReactNode;
  page: 'project-list' | 'project-details';
  isMobile: boolean;
}

const MobileProjectsLayout = ({
  children,
  page,
  isMobile,
}: ProjectsLayoutProps) => {
  const [selectedMode, setSelectedMode] = useState<ViewMode>('list');

  const isMapMode = selectedMode === 'map';

  const isEmbedded = useQueryParamStore((state) => state.embed === 'true');
  const showProjectList = useQueryParamStore((state) => state.showProjectList);
  const showProjectDetails = useQueryParamStore(
    (state) => state.showProjectDetails
  );
  const isContextLoaded = useQueryParamStore((state) => state.isContextLoaded);

  const { isImpersonationModeOn } = useUserProps();

  useEffect(() => {
    if (isEmbedded && isContextLoaded) {
      if (page === 'project-details' && showProjectDetails === 'false') {
        setSelectedMode('map');
      }
      if (page === 'project-list' && showProjectList === 'false') {
        setSelectedMode('map');
      }
    }
  }, [page, isEmbedded, isContextLoaded, showProjectDetails, showProjectList]);

  const mobileLayoutClass = clsx(styles.mobileProjectsLayout, {
    [styles.mapMode]: isMapMode,
    [styles.embedModeMobile]: isEmbedded,
    [styles.impersonationMobile]: isImpersonationModeOn,
  });

  return (
    <ProjectsProvider
      page={page}
      selectedMode={selectedMode}
      setSelectedMode={setSelectedMode}
    >
      <main className={mobileLayoutClass}>
        {isMapMode ? (
          <section className={styles.mobileMapContainer}>
            <ProjectsMap
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              isMobile={isMobile}
              page={page}
            />
          </section>
        ) : (
          <section className={styles.mobileContentContainer}>
            {children}
          </section>
        )}
      </main>
      <Credits isMobile={isMobile} />
    </ProjectsProvider>
  );
};

export default MobileProjectsLayout;

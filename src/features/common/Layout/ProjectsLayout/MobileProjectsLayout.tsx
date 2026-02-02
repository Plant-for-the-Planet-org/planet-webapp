import type { ReactNode } from 'react';

import { useEffect } from 'react';
import styles from './ProjectsLayout.module.scss';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import Credits from '../../../projectsV2/ProjectsMap/Credits';
import { useUserProps } from '../UserPropsContext';
import { clsx } from 'clsx';
import { useQueryParamStore } from '../../../../stores/queryParamStore';
import { useViewStore } from '../../../../stores';

export type ViewMode = 'list' | 'map';
interface ProjectsLayoutProps {
  children: ReactNode;
  isMobile: boolean;
}

const MobileProjectsLayout = ({ children, isMobile }: ProjectsLayoutProps) => {
  // store: state
  const isEmbedded = useQueryParamStore((state) => state.embed === 'true');
  const showProjectList = useQueryParamStore((state) => state.showProjectList);
  const showProjectDetails = useQueryParamStore(
    (state) => state.showProjectDetails
  );
  const isContextLoaded = useQueryParamStore((state) => state.isContextLoaded);
  const currentPage = useViewStore((state) => state.page);
  const selectedMode = useViewStore((state) => state.selectedMode);
  // store: action
  const setSelectedMode = useViewStore((state) => state.setSelectedMode);

  const isMapMode = selectedMode === 'map';
  const { isImpersonationModeOn } = useUserProps();

  useEffect(() => {
    if (isEmbedded && isContextLoaded) {
      if (currentPage === 'project-details' && showProjectDetails === 'false') {
        setSelectedMode('map');
      }
      if (currentPage === 'project-list' && showProjectList === 'false') {
        setSelectedMode('map');
      }
    }
  }, [
    currentPage,
    isEmbedded,
    isContextLoaded,
    showProjectDetails,
    showProjectList,
  ]);

  const mobileLayoutClass = clsx(styles.mobileProjectsLayout, {
    [styles.mapMode]: isMapMode,
    [styles.embedModeMobile]: isEmbedded,
    [styles.impersonationMobile]: isImpersonationModeOn,
  });

  return (
    <>
      <main className={mobileLayoutClass}>
        {isMapMode ? (
          <section className={styles.mobileMapContainer}>
            <ProjectsMap isMobile={isMobile} currentPage={currentPage} />
          </section>
        ) : (
          <section className={styles.mobileContentContainer}>
            {children}
          </section>
        )}
      </main>
      <Credits isMobile={isMobile} />
    </>
  );
};

export default MobileProjectsLayout;

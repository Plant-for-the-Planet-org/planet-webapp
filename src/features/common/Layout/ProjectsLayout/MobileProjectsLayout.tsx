import type { ReactNode } from 'react';
import type { SetState } from '../../types/common';

import { useContext, useEffect, useState } from 'react';
import styles from './ProjectsLayout.module.scss';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import Credits from '../../../projectsV2/ProjectsMap/Credits';
import { ParamsContext } from '../QueryParamsContext';
import { useUserProps } from '../UserPropsContext';
import { clsx } from 'clsx';

export type ViewMode = 'list' | 'map';
interface ProjectsLayoutProps {
  children: ReactNode;
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  page: 'project-list' | 'project-details';
  isMobile: boolean;
}

const MobileProjectsLayout = ({
  children,
  page,
  currencyCode,
  setCurrencyCode,
  isMobile,
}: ProjectsLayoutProps) => {
  const { embed, showProjectList, showProjectDetails, isContextLoaded } =
    useContext(ParamsContext);
  const isEmbedded = embed === 'true';
  const [selectedMode, setSelectedMode] = useState<ViewMode>('list');
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
    [styles.mapMode]: selectedMode === 'map',
    [styles.embedModeMobile]: isEmbedded,
    [styles.impersonationMobile]: isImpersonationModeOn,
  });

  return (
    <ProjectsProvider
      page={page}
      currencyCode={currencyCode}
      setCurrencyCode={setCurrencyCode}
      selectedMode={selectedMode}
      setSelectedMode={setSelectedMode}
    >
      <main className={mobileLayoutClass}>
        {selectedMode === 'map' ? (
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
      <Credits setCurrencyCode={setCurrencyCode} isMobile={isMobile} />
    </ProjectsProvider>
  );
};

export default MobileProjectsLayout;

import type { FC } from 'react';
import type { SetState } from '../../types/common';

import { useContext, useEffect, useState } from 'react';
import styles from './ProjectsLayout.module.scss';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import { ProjectsMapProvider } from '../../../projectsV2/ProjectsMapContext';
import Credits from '../../../projectsV2/ProjectsMap/Credits';
import { ParamsContext } from '../QueryParamsContext';
import { useUserProps } from '../UserPropsContext';

export type ViewMode = 'list' | 'map';
interface ProjectsLayoutProps {
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  page: 'project-list' | 'project-details';
  isMobile: boolean;
}

const MobileProjectsLayout: FC<ProjectsLayoutProps> = ({
  children,
  page,
  currencyCode,
  setCurrencyCode,
  isMobile,
}) => {
  const { embed, showProjectList, showProjectDetails } =
    useContext(ParamsContext);
  const [selectedMode, setSelectedMode] = useState<ViewMode>('list');
  const { isImpersonationModeOn } = useUserProps();

  useEffect(() => {
    if (embed === 'true') {
      if (page === 'project-details' && showProjectDetails === 'false') {
        setSelectedMode('map');
      }
      if (page === 'project-list' && showProjectList === 'false') {
        setSelectedMode('map');
      }
    }
  }, [page, embed, showProjectDetails, showProjectList]);

  const mobileLayoutClass = `${styles.mobileProjectsLayout} ${
    selectedMode === 'map' ? styles.mapMode : ''
  } ${embed === 'true' ? styles.embedModeMobile : ''} ${
    isImpersonationModeOn ? styles.impersonationMobile : ''
  }`;
  return (
    <ProjectsProvider
      page={page}
      currencyCode={currencyCode}
      setCurrencyCode={setCurrencyCode}
      selectedMode={selectedMode}
      setSelectedMode={setSelectedMode}
    >
      <ProjectsMapProvider>
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
      </ProjectsMapProvider>
    </ProjectsProvider>
  );
};

export default MobileProjectsLayout;

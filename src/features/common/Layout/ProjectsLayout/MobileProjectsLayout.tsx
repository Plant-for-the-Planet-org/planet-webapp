import { FC, useState } from 'react';
import styles from './ProjectsLayout.module.scss';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { SetState } from '../../types/common';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import { ProjectsMapProvider } from '../../../projectsV2/ProjectsMapContext';
import Credits from '../../../projects/components/maps/Credits';

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
  const [selectedMode, setSelectedMode] = useState<ViewMode>('list');
  const mobileLayoutClass = `${styles.mobileProjectsLayout} ${
    selectedMode === 'map' && page !== 'project-details' ? styles.mapMode : '' //temporary condition will be updated later on
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
          {selectedMode === 'map' && page !== 'project-details' ? ( //temporary condition will be updated later on
            <section className={styles.mobileMapContainer}>
              <ProjectsMap
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                isMobile={isMobile}
              />
            </section>
          ) : (
            <section className={styles.mobileContentContainer}>
              {children}
            </section>
          )}
        </main>
        <Credits setCurrencyCode={setCurrencyCode} />
      </ProjectsMapProvider>
    </ProjectsProvider>
  );
};

export default MobileProjectsLayout;

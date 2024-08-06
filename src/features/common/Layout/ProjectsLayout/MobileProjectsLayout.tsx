import { FC } from 'react';
import style from './ProjectsLayout.module.scss';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import { SetState } from '../../types/common';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import { ProjectsMapProvider } from '../../../projectsV2/ProjectsMapContext';

interface ProjectsLayoutProps {
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  page: 'project-list' | 'project-details';
  selectedMode: 'list' | 'map';
  setSelectedMode: SetState<'list' | 'map'>;
}

const MobileProjectsLayout: FC<ProjectsLayoutProps> = ({
  children,
  page,
  currencyCode,
  setCurrencyCode,
  selectedMode,
  setSelectedMode,
}) => {
  const mobileLayoutClass = `${style.mobileProjectsLayout} ${
    selectedMode === 'map' ? style.mapMode : ''
  }`;

  return (
    <ProjectsProvider
      page={page}
      currencyCode={currencyCode}
      setCurrencyCode={setCurrencyCode}
    >
      <ProjectsMapProvider>
        <main className={mobileLayoutClass}>
          {selectedMode === 'map' ? (
            <section className={style.mobileMapContainer}>
              <ProjectsMap
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
              />
            </section>
          ) : (
            <section className={style.mobileContentContainer}>
              {children}
            </section>
          )}
        </main>
      </ProjectsMapProvider>
    </ProjectsProvider>
  );
};

export default MobileProjectsLayout;

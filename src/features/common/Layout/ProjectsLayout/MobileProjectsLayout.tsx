import { FC, useState } from 'react';
import style from './ProjectsLayout.module.scss';
import ProjectsMap from '../../../projectsV2/ProjectsMap';
import WebappButton from '../../WebappButton';
import { SetState } from '../../types/common';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';
import { ProjectsMapProvider } from '../../../projectsV2/ProjectsMapContext';

interface ProjectsLayoutProps {
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  page: 'project-list' | 'project-details';
}

const MobileProjectsLayout: FC<ProjectsLayoutProps> = ({
  children,
  page,
  currencyCode,
  setCurrencyCode,
}) => {
  const [isMapMode, setIsMapMode] = useState(false);

  const mobileLayoutClass = `${style.mobileProjectsLayout} ${
    isMapMode ? style.mapMode : ''
  }`;

  const viewButtonClass = `${style.viewButton} ${
    isMapMode ? style.viewButtonShifted : ''
  }`;

  return (
    <ProjectsProvider
      page={page}
      currencyCode={currencyCode}
      setCurrencyCode={setCurrencyCode}
    >
      <ProjectsMapProvider>
        <main className={mobileLayoutClass}>
          {isMapMode ? (
            <section className={style.mobileMapContainer}>
              <ProjectsMap />
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

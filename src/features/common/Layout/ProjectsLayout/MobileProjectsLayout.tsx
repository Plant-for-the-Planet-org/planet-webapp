import { FC, useState } from 'react';
import style from './ProjectsLayout.module.scss';
import ProjectsMap from './ProjectsMap';
import WebappButton from '../../WebappButton';
import { SetState } from '../../types/common';
import { ProjectsProvider } from '../../../projectsV2/ProjectsContext';

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
      <main className={mobileLayoutClass}>
        <WebappButton
          text={isMapMode ? 'View Info' : 'View Map'}
          variant="primary"
          elementType="button"
          onClick={() => setIsMapMode(!isMapMode)}
          buttonClasses={viewButtonClass}
        />
        {isMapMode ? (
          <section className={style.mobileMapContainer}>
            <ProjectsMap />
          </section>
        ) : (
          <section className={style.mobileContentContainer}>{children}</section>
        )}
      </main>
    </ProjectsProvider>
  );
};

export default MobileProjectsLayout;

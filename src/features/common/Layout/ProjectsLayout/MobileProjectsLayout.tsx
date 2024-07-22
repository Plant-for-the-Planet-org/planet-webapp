import { ReactElement, useState } from 'react';
import style from './ProjectsLayout.module.scss';
import ProjectsMap from './ProjectsMap';
import WebappButton from '../../WebappButton';

const MobileProjectsLayout = ({ children }: { children: ReactElement }) => {
  const [isMapMode, setIsMapMode] = useState(false);

  const mobileLayoutClass = `${style.mobileProjectsLayout} ${
    isMapMode ? style.compact : ''
  }`;

  const viewButtonClass = `${style.viewButton} ${
    isMapMode ? style.viewButtonShifted : ''
  }`;

  return (
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
  );
};

export default MobileProjectsLayout;

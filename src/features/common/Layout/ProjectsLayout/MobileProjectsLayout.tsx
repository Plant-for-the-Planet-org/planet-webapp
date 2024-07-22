import { ReactElement, useState } from 'react';
import style from './ProjectsLayout.module.scss';
import ProjectsMap from './ProjectsMap';
import WebappButton from '../../WebappButton';

const MobileProjectsLayout = ({ children }: { children: ReactElement }) => {
  const [isMap, setIsMap] = useState(false);

  const mobileLayoutClass = `${style.mobileProjectsLayout} ${
    isMap ? style.compact : ''
  }`;

  return (
    <main className={mobileLayoutClass}>
      <WebappButton
        text="Map"
        variant="primary"
        elementType="button"
        onClick={() => setIsMap(!isMap)}
        buttonClasses={style.mapButton}
      />
      {isMap ? (
        <section className={style.mobileMapContainer}>
          <ProjectsMap />
        </section>
      ) : (
        <section className={style.projectlistAndDetail}>{children}</section>
      )}
    </main>
  );
};

export default MobileProjectsLayout;

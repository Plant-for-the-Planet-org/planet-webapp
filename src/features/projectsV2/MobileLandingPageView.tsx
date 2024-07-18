import style from './MobileLandingPageView.module.scss';
import { projects } from '../../utils/projectRedesign';
import { useState } from 'react';

const ProjectList = ({ isMapVisible }: { isMapVisible: boolean }) => {
  return (
    <>
      {!isMapVisible && (
        <div className={style.projectListMainContainer}>
          <div className={style.projectListSubContainer}>
            {projects.map((project) => (
              <div key={project.id} className={style.projectCard}>
                <h3>{project.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const MainMap = () => {
  return <div className={style.mainMapContainer}></div>;
};

const MobileLandingPageView = () => {
  const [isMapVisible, setIsMapVisible] = useState(false);

  const mapButtonClass = isMapVisible
    ? style.activeMapTab
    : style.inActiveMapTab;

  return (
    <div className={style.mobileLandingPage}>
      {isMapVisible ? <MainMap /> : <ProjectList isMapVisible={isMapVisible} />}
      <div className={style.projectListControltabsContainer}>
        <button
          className={mapButtonClass}
          onClick={() => setIsMapVisible(!isMapVisible)}
        >
          Map
        </button>
      </div>
    </div>
  );
};

export default MobileLandingPageView;

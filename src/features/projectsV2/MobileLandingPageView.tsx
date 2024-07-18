import style from './MobileLandingPageView.module.scss';
import { projects } from '../../utils/projectRedesign';

const MobileLandingPageView = () => {
  return (
    <div className={style.mobileLandingPage}>
      <div className={style.projectListControltabsContainer}>Control tabs</div>
      <div className={style.projectListMainContainer}>
        <div className={style.projectListSubContainer}>
          {projects.map((project) => (
            <div key={project.id} className={style.projectCard}>
              <h3>{project.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileLandingPageView;

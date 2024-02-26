import DiveIcon from '../icons/DiveIcon';
import style from './SingleProjectMap.module.scss';
import { useTranslation } from 'next-i18next';

interface ProjectViewProps {
  active: boolean;
}

const ProjectView = ({ active }: ProjectViewProps) => {
  const { t } = useTranslation(['projectDetails']);
  return (
    <div className={style.projectViewMainContainer}>
      <button className={style.diveIntoProjectButton}>
        <div style={{ marginTop: '1px' }}>
          <DiveIcon />
        </div>
        <div className={style.label}>
          {t('projectDetails:diveIntoTheProject')}
        </div>
      </button>
    </div>
  );
};

export default ProjectView;

import DiveIcon from '../icons/DiveIcon';
import style from './projectView.module.scss';
import { useTranslation } from 'next-i18next';

interface projectViewProps {
  active: boolean;
}

const ProjectView = ({ active }: projectViewProps) => {
  const { t } = useTranslation(['projectDetails']);
  return (
    <div className={style.projectViewMainContainer}>
      <button className={style.diveIntoProjectButton}>
        <div>
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

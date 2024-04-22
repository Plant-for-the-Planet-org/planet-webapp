import DiveIcon from '../icons/DiveIcon';
import style from './DiveIntoMap.module.scss';
import { useTranslation } from 'next-i18next';

const ShowMapButton = () => {
  const { t } = useTranslation(['projectDetails']);
  return (
    <>
      <button className={style.diveIntoProjectButton}>
        <div className={style.diveIconContainer}>
          <DiveIcon />
        </div>
        <div className={style.label}>
          {t('projectDetails:diveIntoTheProject')}
        </div>
      </button>
    </>
  );
};

export default ShowMapButton;

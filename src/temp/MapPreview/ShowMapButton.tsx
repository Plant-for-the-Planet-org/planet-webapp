import ExpandIcon from '../icons/ExpandIcon';
import style from './MapPreview.module.scss';
import { useTranslation } from 'next-i18next';

const ShowMapButton = () => {
  const { t } = useTranslation(['projectDetails']);
  return (
    <>
      <button className={style.showMapButton}>
        <div className={style.buttonIconContainer}>
          <ExpandIcon />
        </div>
        <div className={style.label}>
          {t('projectDetails:diveIntoTheProject')}
        </div>
      </button>
    </>
  );
};

export default ShowMapButton;

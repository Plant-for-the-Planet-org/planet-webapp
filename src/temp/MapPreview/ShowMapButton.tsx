import ExpandIcon from '../icons/ExpandIcon';
import style from './MapPreview.module.scss';
import { useTranslations } from 'next-intl';

const ShowMapButton = () => {
  const t = useTranslations('ProjectDetails');
  return (
    <>
      <button className={style.showMapButton}>
        <div className={style.buttonIconContainer}>
          <ExpandIcon />
        </div>
        <div className={style.label}>{t('diveIntoTheProject')}</div>
      </button>
    </>
  );
};

export default ShowMapButton;

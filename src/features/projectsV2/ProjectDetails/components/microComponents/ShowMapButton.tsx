import ExpandIcon from '../../../../../temp/icons/ExpandIcon';
import style from '../../styles/MapPreview.module.scss';
import { useTranslations } from 'next-intl';

type ShowMapButtonProp = {
  handleMap: () => void;
};

const ShowMapButton = ({ handleMap }: ShowMapButtonProp) => {
  const t = useTranslations('ProjectDetails');

  return (
    <>
      <button className={style.diveToMap} onClick={handleMap}>
        <div className={style.buttonIconContainer}>
          <ExpandIcon />
        </div>
        <div className={style.label}>{t('diveIntoTheProject')}</div>
      </button>
    </>
  );
};

export default ShowMapButton;

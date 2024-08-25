import ExpandIcon from '../../../../../temp/icons/ExpandIcon';
import style from '../../styles/MapPreview.module.scss';
import { useTranslations } from 'next-intl';
import { SetState } from '../../../../common/types/common';
import { ViewMode } from '../../../../common/Layout/ProjectsLayout/MobileProjectsLayout';

type ShowMapButtonProp = {
  setSelectedMode: SetState<ViewMode> | undefined;
};

const ShowMapButton = ({ setSelectedMode }: ShowMapButtonProp) => {
  const t = useTranslations('ProjectDetails');

  return (
    <>
      <button
        className={style.diveToMap}
        onClick={() => {
          if (setSelectedMode) setSelectedMode('map');
        }}
      >
        <div className={style.buttonIconContainer}>
          <ExpandIcon />
        </div>
        <div className={style.label}>{t('diveIntoTheProject')}</div>
      </button>
    </>
  );
};

export default ShowMapButton;

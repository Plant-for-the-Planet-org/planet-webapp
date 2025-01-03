import ExpandIcon from '../../../../../../public/assets/images/icons/projectV2/ExpandIcon';
import style from '../../styles/MapPreview.module.scss';
import { useTranslations } from 'next-intl';

type ShowMapButtonProp = {
  handleMap: () => void;
};

const ShowMapButton = ({ handleMap }: ShowMapButtonProp) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  return (
    <>
      <button className={style.diveToMap} onClick={handleMap}>
        <div className={style.buttonIconContainer}>
          <ExpandIcon />
        </div>
        <div className={style.label}>
          {tProjectDetails('diveIntoTheProject')}
        </div>
      </button>
    </>
  );
};

export default ShowMapButton;

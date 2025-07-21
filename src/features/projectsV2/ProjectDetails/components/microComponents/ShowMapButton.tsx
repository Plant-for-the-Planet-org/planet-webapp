import ExpandIcon from '../../../../../../public/assets/images/icons/projectV2/ExpandIcon';
import styles from '../../styles/MapPreview.module.scss';
import { useTranslations } from 'next-intl';

type ShowMapButtonProp = {
  handleMap: () => void;
};

const ShowMapButton = ({ handleMap }: ShowMapButtonProp) => {
  const tProjectDetails = useTranslations('ProjectDetails');

  return (
    <>
      <button className={styles.diveToMap} onClick={handleMap}>
        <div className={styles.buttonIconContainer}>
          <ExpandIcon />
        </div>
        <div className={styles.label}>
          {tProjectDetails('diveIntoTheProject')}
        </div>
      </button>
    </>
  );
};

export default ShowMapButton;

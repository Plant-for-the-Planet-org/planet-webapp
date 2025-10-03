import type { SetState } from '../../../../common/types/common';

import { useTranslations } from 'next-intl';
import styles from '../../StepForm.module.scss';

interface LayerToggleProps {
  isSatelliteMode: boolean;
  setIsSatelliteMode: SetState<boolean>;
}

const LayerToggle = ({
  isSatelliteMode,
  setIsSatelliteMode,
}: LayerToggleProps) => {
  const tManageProjects = useTranslations('ManageProjects');
  return (
    <div className={styles.layerToggle}>
      <div
        onClick={() => setIsSatelliteMode(false)}
        className={`${styles.layerOption} ${
          isSatelliteMode ? '' : styles.active
        }`}
      >
        {tManageProjects('mapView.map')}
      </div>
      <div
        onClick={() => setIsSatelliteMode(true)}
        className={`${styles.layerOption} ${
          isSatelliteMode ? styles.active : ''
        }`}
      >
        {tManageProjects('mapView.satellite')}
      </div>
    </div>
  );
};

export default LayerToggle;

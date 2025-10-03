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
      <button
        type="button"
        onClick={() => setIsSatelliteMode(false)}
        className={`${styles.layerOption} ${
          isSatelliteMode ? '' : styles.active
        }`}
        aria-pressed={!isSatelliteMode}
      >
        {tManageProjects('mapView.map')}
      </button>
      <button
        type="button"
        onClick={() => setIsSatelliteMode(true)}
        className={`${styles.layerOption} ${
          isSatelliteMode ? styles.active : ''
        }`}
        aria-pressed={isSatelliteMode}
      >
        {tManageProjects('mapView.satellite')}
      </button>
    </div>
  );
};

export default LayerToggle;

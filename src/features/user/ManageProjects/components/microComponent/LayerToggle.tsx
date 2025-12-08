import type { SetState } from '../../../../common/types/common';

import { useTranslations } from 'next-intl';
import styles from '../../StepForm.module.scss';
import { clsx } from 'clsx';

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
        className={clsx(styles.layerOption, {
          [styles.active]: !isSatelliteMode,
        })}
        aria-pressed={!isSatelliteMode}
      >
        {tManageProjects('mapView.map')}
      </button>
      <button
        type="button"
        onClick={() => setIsSatelliteMode(true)}
        className={clsx(styles.layerOption, {
          [styles.active]: isSatelliteMode,
        })}
        aria-pressed={isSatelliteMode}
      >
        {tManageProjects('mapView.satellite')}
      </button>
    </div>
  );
};

export default LayerToggle;

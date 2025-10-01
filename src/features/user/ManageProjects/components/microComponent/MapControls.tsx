import type { SetState } from '../../../../common/types/common';

import DeleteIcon from '../../../../../../public/assets/images/icons/DeleteIcon';
import PolygonDrawIcon from '../../../../../../public/assets/images/icons/manageProjects/PolygonDrawIcon';
import styles from '../../StepForm.module.scss';
import { useTranslations } from 'next-intl';

interface MapControllersProp {
  setIsDrawing: SetState<boolean>;
  coordinates: number[][];
  setCoordinates: SetState<number[][]>;
  isSatelliteMode: boolean;
  setIsSatelliteMode: SetState<boolean>;
}

const MapControls = ({
  setIsDrawing,
  coordinates,
  setCoordinates,
  isSatelliteMode,
  setIsSatelliteMode,
}: MapControllersProp) => {
  const tManageProjects = useTranslations('ManageProjects');
  return (
    <>
      <div className={styles.mapControllers}>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsDrawing((prev) => !prev);
          }}
        >
          <PolygonDrawIcon />
        </button>
        {
          <button
            onClick={(e) => {
              e.preventDefault();
              setCoordinates([]);
            }}
            disabled={coordinates.length === 0}
          >
            <DeleteIcon />
          </button>
        }
      </div>
      <div className={styles.layerToggle}>
        <div
          onClick={() => setIsSatelliteMode(false)}
          className={`${styles.layerOption} ${
            isSatelliteMode ? '' : styles.active
          }`}
        >
          {tManageProjects('mapType.map')}
        </div>
        <div
          onClick={() => setIsSatelliteMode(true)}
          className={`${styles.layerOption} ${
            isSatelliteMode ? styles.active : ''
          }`}
        >
          {tManageProjects('mapType.satellite')}
        </div>
      </div>
    </>
  );
};

export default MapControls;

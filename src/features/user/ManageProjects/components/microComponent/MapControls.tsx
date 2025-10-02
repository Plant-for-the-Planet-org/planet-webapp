import type { SetState } from '../../../../common/types/common';

import DeleteIcon from '../../../../../../public/assets/images/icons/DeleteIcon';
import PolygonDrawIcon from '../../../../../../public/assets/images/icons/manageProjects/PolygonDrawIcon';
import styles from '../../StepForm.module.scss';
import { useTranslations } from 'next-intl';

interface MapControllersProp {
  isDrawing: boolean;
  setIsDrawing: SetState<boolean>;
  coordinates: number[][];
  setCoordinates: SetState<number[][]>;
  isSatelliteMode: boolean;
  setIsSatelliteMode: SetState<boolean>;
}

const MapControls = ({
  isDrawing,
  setIsDrawing,
  coordinates,
  setCoordinates,
  isSatelliteMode,
  setIsSatelliteMode,
}: MapControllersProp) => {
  const tManageProjects = useTranslations('ManageProjects');
  const showDeleteButton = coordinates.length > 0;
  return (
    <>
      <div className={styles.mapControls}>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsDrawing((prev) => !prev);
          }}
          title={
            isDrawing
              ? 'Drawing mode active (click to stop)'
              : 'Start polygon drawing'
          }
          aria-label={
            isDrawing ? 'Stop Polygon Drawing' : 'Start Polygon Drawing'
          }
          className={isDrawing ? styles.activePolygonButton : ''}
        >
          <PolygonDrawIcon />
        </button>
        {showDeleteButton && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setCoordinates([]);
            }}
            title="Delete Polygon"
            aria-label="Delete Polygon"
          >
            <DeleteIcon />
          </button>
        )}
      </div>
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
    </>
  );
};

export default MapControls;

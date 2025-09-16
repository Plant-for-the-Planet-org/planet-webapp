import type { SetState } from '../../../../common/types/common';

import DeleteIcon from '../../../../../../public/assets/images/icons/DeleteIcon';
import PolygonDrawIcon from '../../../../../../public/assets/images/icons/manageProjects/PolygonDrawIcon';
import styles from '../../StepForm.module.scss';

interface MapControllersProp {
  setIsDrawing: SetState<boolean>;
  coordinates: number[][];
  setCoordinates: SetState<number[][]>;
  satellite: boolean;
  setSatellite: SetState<boolean>;
}

const MapControllers = ({
  setIsDrawing,
  coordinates,
  setCoordinates,
  satellite,
  setSatellite,
}: MapControllersProp) => {
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
      <div className={styles.layerSwitcher}>
        <div
          onClick={() => setSatellite(false)}
          className={`${styles.layerOption} ${satellite ? '' : styles.active}`}
        >
          Map
        </div>
        <div
          onClick={() => setSatellite(true)}
          className={`${styles.layerOption} ${satellite ? styles.active : ''}`}
        >
          Satellite
        </div>
      </div>
    </>
  );
};

export default MapControllers;

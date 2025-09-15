import type { SetState } from '../../../../common/types/common';

import DeleteIcon from '../../../../../../public/assets/images/icons/DeleteIcon';
import PolygonDrawIcon from '../../../../../../public/assets/images/icons/manageProjects/PolygonDrawIcon';
import styles from '../../StepForm.module.scss';

interface MapControllersProp {
  setIsDrawing: SetState<boolean>;
  coordinates: number[][];
  setCoordinates: SetState<number[][]>;
}

const MapControllers = ({
  setIsDrawing,
  coordinates,
  setCoordinates,
}: MapControllersProp) => {
  return (
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
  );
};

export default MapControllers;

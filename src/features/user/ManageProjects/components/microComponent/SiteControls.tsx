import type { SetState } from '../../../../common/types/common';

import DeleteIcon from '../../../../../../public/assets/images/icons/DeleteIcon';
import PolygonDrawIcon from '../../../../../../public/assets/images/icons/manageProjects/PolygonDrawIcon';
import styles from '../../StepForm.module.scss';

interface SiteControlsProp {
  isDrawing: boolean;
  setIsDrawing: SetState<boolean>;
  coordinates: number[][];
  setCoordinates: SetState<number[][]>;
}

const SiteControls = ({
  isDrawing,
  setIsDrawing,
  coordinates,
  setCoordinates,
}: SiteControlsProp) => {
  const showDeleteButton = coordinates.length > 0;
  return (
    <div className={styles.siteControls}>
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
  );
};

export default SiteControls;

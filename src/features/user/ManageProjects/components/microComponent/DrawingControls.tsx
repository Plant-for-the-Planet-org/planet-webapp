import type { SetState } from '../../../../common/types/common';

import DeleteIcon from '../../../../../../public/assets/images/icons/DeleteIcon';
import PolygonDrawIcon from '../../../../../../public/assets/images/icons/manageProjects/PolygonDrawIcon';
import styles from '../../StepForm.module.scss';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';

interface DrawingControlsProp {
  isDrawing: boolean;
  setIsDrawing: SetState<boolean>;
  coordinates: number[][];
  setCoordinates: SetState<number[][]>;
}

const DrawingControls = ({
  isDrawing,
  setIsDrawing,
  coordinates,
  setCoordinates,
}: DrawingControlsProp) => {
  const showDeleteButton = coordinates.length > 0;
  const tManageProjects = useTranslations('ManageProjects');
  return (
    <div className={styles.drawingControls}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsDrawing((prev) => !prev);
        }}
        title={
          isDrawing
            ? tManageProjects('drawing.polygon.active')
            : tManageProjects('drawing.polygon.start')
        }
        aria-label={
          isDrawing
            ? tManageProjects('drawing.polygon.stop')
            : tManageProjects('drawing.polygon.start')
        }
        className={clsx(isDrawing && styles.activePolygonButton)}
      >
        <PolygonDrawIcon />
      </button>
      {showDeleteButton && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setCoordinates([]);
          }}
          title={tManageProjects('drawing.polygon.delete')}
          aria-label={tManageProjects('drawing.polygon.delete')}
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default DrawingControls;

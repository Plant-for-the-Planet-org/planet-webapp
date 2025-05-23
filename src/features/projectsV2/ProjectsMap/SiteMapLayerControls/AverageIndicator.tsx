import AverageMarkerIcon from '../../../../../public/assets/images/icons/projectV2/AverageMarkerIcon';
import styles from './SiteMapLayerControls.module.scss';

interface AverageIndicatorProps {
  min: number;
  max: number;
  average: number;
  barWidth: number;
  unit?: string;
}

const AverageIndicator = ({
  min,
  max,
  average,
  unit,
  barWidth,
}: AverageIndicatorProps) => {
  const getAveragePosition = () => {
    const range = max - min;
    const averageOffset = average - min;
    return (averageOffset / range) * 100;
  };

  const averagePosition = getAveragePosition();

  const INDICATOR_WIDTH = 50;
  const leftThreshold =
    barWidth > 0 ? (INDICATOR_WIDTH / 2 / barWidth) * 100 : 0;
  const rightThreshold =
    barWidth > 0 ? 100 - (INDICATOR_WIDTH / 2 / barWidth) * 100 : 100;

  const isNearLeftEdge = averagePosition < leftThreshold;
  const isNearRightEdge = averagePosition > rightThreshold;

  const averageIndicatorStyles = `${styles.averageIndicator} ${
    average > 0 ? styles.positive : styles.negative
  } ${isNearLeftEdge ? styles.leftAligned : ''} ${
    isNearRightEdge ? styles.rightAligned : ''
  }`;

  return (
    <div
      className={averageIndicatorStyles}
      style={{ left: `${averagePosition}%` }}
    >
      <AverageMarkerIcon width={30} />
      <div className={styles.averageLabel}>
        <div className={styles.averageLabelText}>Average</div>
        <div className={styles.averageValue}>
          {average} {unit ? ` ${unit}` : ''}
        </div>
      </div>
    </div>
  );
};

export default AverageIndicator;

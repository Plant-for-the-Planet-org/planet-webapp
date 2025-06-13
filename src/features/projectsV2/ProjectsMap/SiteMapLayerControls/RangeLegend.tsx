import type { RangeLegendData } from '../../../../utils/mapsV2/siteLayerOptions';

import { useEffect, useMemo, useRef, useState } from 'react';
import AverageIndicator from './AverageIndicator';
import styles from './SiteMapLayerControls.module.scss';

interface RangeLegendProps {
  legend: RangeLegendData;
}

const RangeLegend = ({ legend }: RangeLegendProps) => {
  const legendBarRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);
  const { min, max, average, unit, gradient } = legend;
  const hasAverage = average !== undefined;

  // Update bar width when ref is set and on window resize
  useEffect(() => {
    const updateBarWidth = () => {
      if (legendBarRef.current) {
        const width = legendBarRef.current.offsetWidth;
        setBarWidth(width);
      }
    };

    if (legendBarRef.current) {
      updateBarWidth();
      window.addEventListener('resize', updateBarWidth);

      return () => {
        window.removeEventListener('resize', updateBarWidth);
      };
    }
  }, [legendBarRef.current]);

  // Calculate overlap detection
  const overlapInfo = useMemo(() => {
    if (!hasAverage || barWidth === 0) {
      return { showMin: true, showMax: true, averagePosition: 0 };
    }

    const range = max - min;
    const averageOffset = average - min;
    const averagePosition = (averageOffset / range) * 100;

    // Calculate thresholds based on text/indicator widths
    const MIN_MAX_WIDTH = 60; // Width of min/max text
    const INDICATOR_WIDTH = 50; // Width of average indicator

    const leftThreshold =
      ((MIN_MAX_WIDTH / 2 + INDICATOR_WIDTH / 2) / barWidth) * 100;
    const rightThreshold =
      100 - ((MIN_MAX_WIDTH / 2 + INDICATOR_WIDTH / 2) / barWidth) * 100;

    return {
      showMin: averagePosition > leftThreshold,
      showMax: averagePosition < rightThreshold,
      averagePosition,
    };
  }, [hasAverage, barWidth, min, max, average]);

  const { showMin, showMax } = overlapInfo;

  const legendTitle = useMemo(() => {
    const parts = [`Range: ${min} to ${max} ${unit || ''}`];

    if (hasAverage) {
      parts.push(`Average: ${average} ${unit || ''}`);
    }

    return parts.join(' | ');
  }, [min, max, average, unit, hasAverage]);

  const formatValue = (value: number) => `${value} ${unit ? ` ${unit}` : ''}`;

  return (
    <div className={styles.siteLayerLegend}>
      <div
        className={styles.legendBarContainer}
        title={legendTitle}
        aria-label={legendTitle}
      >
        <div
          className={styles.legendBar}
          style={{ background: gradient }}
          ref={legendBarRef}
        />
        {hasAverage && (
          <AverageIndicator
            min={min}
            max={max}
            average={average}
            unit={unit}
            barWidth={barWidth}
          />
        )}
      </div>
      <div className={styles.legendValues}>
        {showMin && <div>{formatValue(min)}</div>}
        {showMax && <div>{formatValue(max)}</div>}
      </div>
    </div>
  );
};

export default RangeLegend;

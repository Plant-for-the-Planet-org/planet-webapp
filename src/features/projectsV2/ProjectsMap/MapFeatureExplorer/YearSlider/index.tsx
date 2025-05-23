// Unused code - for future reference while implementing the deforestation timeline slider

import { useState } from 'react';
import { SmallSlider } from './CustomSlider';
import styles from './YearSlider.module.scss';
import PlayIcon from '../../../../../../public/assets/images/icons/projectV2/PlayIcon';

export interface YearRangeSliderProps {
  startYear: number;
  endYear: number;
}

export const YearRangeSlider = () => {
  const minDistance = 10;
  const [value1, setValue1] = useState<number[]>([20, 37]);

  function valuetext(value: number) {
    return `${value}°C`;
  }

  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  return (
    <div className={styles.rangeMainContainer}>
      <div className={styles.rangeContainer}>
        <div className={styles.playIconContainer}>
          <PlayIcon width={'8px'} />
        </div>
        <div className={styles.sliderContainer}>
          <SmallSlider
            getAriaLabel={() => 'Minimum distance'}
            value={value1}
            onChange={handleChange1}
            getAriaValueText={valuetext}
            disableSwap
          />
        </div>
      </div>
      <div className={styles.yearRangeContainer}>
        <div className={styles.startYear}>{'2012'}</div>
        <div className={styles.endYear}>{'2024'}</div>
      </div>
    </div>
  );
};

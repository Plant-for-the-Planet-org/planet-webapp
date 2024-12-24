import type { MapOptions } from '../../ProjectsMapContext';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ExploreIcon } from '../../../../../public/assets/images/icons/projectV2/ExploreIcon';
import styles from './MapFeatureExplorer.module.scss';
// import { SmallSlider } from './CustomSlider';
// import PlayIcon from '../../../../../public/assets/images/icons/projectV2/PlayIcon';
import CustomButton from './CustomButton';
import MapSettings from './MapSettings';
import { Modal } from '@mui/material';

/* interface ExploreProjectProps {
  label: string | string[];
  isOpen: boolean;
  startYear: number;
  endYear: number;
} */

interface EcosystemOptionProps {
  label: string;
  switchComponent: React.ReactNode;
}

export interface YearRangeSliderProps {
  startYear: number;
  endYear: number;
}

export const MapLayerToggle = ({
  label,
  switchComponent,
}: EcosystemOptionProps) => {
  return (
    <>
      <div className={styles.toggleMainContainer}>
        <div className={styles.toggleContainer}>
          <div>{label}</div>
        </div>
        <div className={styles.switchContainer}>{switchComponent}</div>
      </div>
    </>
  );
};

/* export const YearRangeSlider = () => {
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
}; */

type MapFeatureExplorerProps = {
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
  isMobile?: boolean;
};

const MapFeatureExplorer = ({
  mapOptions,
  updateMapOption,
  isMobile,
}: MapFeatureExplorerProps) => {
  const t = useTranslations('Maps');
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.mapFeatureExplorer}>
      <CustomButton
        startIcon={<ExploreIcon />}
        onClick={() => setIsOpen(!isOpen)}
        className={isOpen ? 'active' : ''}
      >
        {t('explore')}
      </CustomButton>

      {isOpen && !isMobile && (
        <MapSettings
          mapOptions={mapOptions}
          updateMapOption={updateMapOption}
        />
      )}
      {isMobile && (
        <Modal open={isOpen}>
          <MapSettings
            mapOptions={mapOptions}
            updateMapOption={updateMapOption}
            isMobile={isMobile}
            setIsOpen={setIsOpen}
          />
        </Modal>
      )}
    </div>
  );
};

export default MapFeatureExplorer;

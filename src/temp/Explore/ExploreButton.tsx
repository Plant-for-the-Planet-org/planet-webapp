import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { ExploreIcon } from '../icons/ExploreIcon';
import style from './Explore.module.scss';
import InfoIcon from '../icons/InfoIcon';
import {
  SmallSwitch,
  SmallSwitchBlue,
  SmallSwitchDarkGreen,
  SmallSwitchRed,
} from './CustomSwitch';
import { SmallSlider } from './CustomSlider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface ExploreButtonProps {
  label: string | string[];
  isOpen: boolean;
  startYear: number;
  endYear: number;
}

interface EcosystemOptionProps {
  infoIcon: React.ReactNode;
  label: string;
  switchComponent: React.ReactNode;
}

interface YearRangeSliderProps {
  startYear: number;
  endYear: number;
}

export const EcosystemOption = ({
  infoIcon,
  label,
  switchComponent,
}: EcosystemOptionProps) => {
  return (
    <>
      <div className={style.ecosystemMainContainer}>
        <div className={style.ecosystemContainer}>
          <div className={style.infoIconConatiner}>{infoIcon}</div>
          <div>{label}</div>
        </div>
        <div className={style.switchContainer}>{switchComponent}</div>
      </div>
    </>
  );
};

export const YearRangeSlider = ({
  startYear,
  endYear,
}: YearRangeSliderProps) => {
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
    <div className={style.rangeMainContainer}>
      <div className={style.rangeContainer}>
        <div className={style.playIconContainer}>
          <PlayArrowIcon
            fontSize="medium"
            sx={{
              position: 'absolute',
              top: '-8px',
              left: '-6px',
              width: '16px',
              height: '1em',
            }}
          />
        </div>
        <div className={style.sliderContainer}>
          <SmallSlider
            getAriaLabel={() => 'Minimum distance'}
            value={value1}
            onChange={handleChange1}
            getAriaValueText={valuetext}
            disableSwap
          />
        </div>
      </div>
      <div className={style.startYear}>{startYear}</div>
      <div className={style.endYear}>{endYear}</div>
    </div>
  );
};

const ExploreButton = ({
  label,
  isOpen,
  startYear,
  endYear,
}: ExploreButtonProps) => {
  return (
    <>
      <Button startIcon={<ExploreIcon />} className={style.customButton}>
        {label}
      </Button>
      {isOpen ? (
        <div className={style.exploreMainContainer}>
          <div className={style.exploreContainer}>
            <div>
              <EcosystemOption
                infoIcon={<InfoIcon />}
                label={'Current Forest'}
                switchComponent={<SmallSwitchDarkGreen />}
              />
              <hr />
              <EcosystemOption
                infoIcon={<InfoIcon />}
                label={'Restoration Potential'}
                switchComponent={<SmallSwitchBlue />}
              />
              <hr />
              <EcosystemOption
                infoIcon={<InfoIcon />}
                label={'Deforestation'}
                switchComponent={<SmallSwitchRed />}
              />
              <YearRangeSlider startYear={startYear} endYear={endYear} />
              <hr />
              <EcosystemOption
                infoIcon={undefined}
                label={'Projects'}
                switchComponent={<SmallSwitch />}
              />
            </div>
            <div className={style.exploreDescription}>
              The world has about 3 trillion trees today (“Forests”). And space
              for up to a trillion more (“Reforestation Potential”).
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ExploreButton;

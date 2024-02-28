import React, { useState } from 'react';
import { ExploreIcon } from '../icons/ExploreIcon';
import style from './Explore.module.scss';
import InfoIcon from '../icons/InfoIcon';
import { StyledSwitch } from './CustomSwitch';
import { SmallSlider } from './CustomSlider';
import PlayIcon from '../icons/PlayIcon';
import { useTranslation } from 'next-i18next';
import CustomButton from './CustomButton';

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
          <PlayIcon />
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
  const { t } = useTranslation(['allProjects']);

  return (
    <>
      <CustomButton startIcon={<ExploreIcon />}>{label}</CustomButton>

      {isOpen ? (
        <div className={style.exploreMainContainer}>
          <div className={style.exploreContainer}>
            <div>
              <EcosystemOption
                infoIcon={<InfoIcon />}
                label={t('allProjects:currentForests')}
                switchComponent={<StyledSwitch currentForestSwitch />}
              />
              <div className={style.hrLine} />
              <EcosystemOption
                infoIcon={<InfoIcon />}
                label={t('allProjects:restorationPotential')}
                switchComponent={<StyledSwitch restorationSwitch />}
              />
              <div className={style.hrLine} />
              <EcosystemOption
                infoIcon={<InfoIcon />}
                label={t('allProjects:deforestation')}
                switchComponent={<StyledSwitch deforestrationSwitch />}
              />
              <YearRangeSlider startYear={startYear} endYear={endYear} />
              <div className={style.hrLine} />
              <EcosystemOption
                infoIcon={undefined}
                label={t('allProjects:projects')}
                switchComponent={<StyledSwitch />}
              />
            </div>
            <div className={style.exploreDescription}>
              {t('allProjects:exploreDescription')}
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

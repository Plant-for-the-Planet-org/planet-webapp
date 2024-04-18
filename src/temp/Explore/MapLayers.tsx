import { useState, ChangeEvent } from 'react';
import style from '../Explore/Explore.module.scss';
import { MapLayerToggle } from './ExploreProject';
import InfoIcon from '../icons/InfoIcon';
import { StyledSwitch } from './CustomSwitch';
import { YearRangeSlider } from './ExploreProject';
import { useTranslation } from 'next-i18next';
import { YearRangeSliderProps } from './ExploreProject';

const MapLayers = ({ startYear, endYear }: YearRangeSliderProps) => {
  const [checked, setChecked] = useState(false);
  const { t } = useTranslation(['allProjects', 'maps']);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className={style.exploreMainContainer}>
      <div className={style.exploreContainer}>
        <div>
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={t('allProjects:currentForests')}
            switchComponent={<StyledSwitch currentforestswitch="true" />}
          />
          <div className={style.hrLine} />
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={t('allProjects:restorationPotential')}
            switchComponent={<StyledSwitch restorationswitch="true" />}
          />
          <div className={style.hrLine} />
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={t('allProjects:deforestation')}
            switchComponent={
              <StyledSwitch
                deforestationswitch="true"
                onChange={handleChange}
              />
            }
          />
          {checked && (
            <YearRangeSlider startYear={startYear} endYear={endYear} />
          )}
          <div className={style.hrLine} />
          <MapLayerToggle
            infoIcon={undefined}
            label={t('allProjects:projects')}
            switchComponent={<StyledSwitch />}
          />
        </div>
        <div className={style.exploreDescription}>
          {t('maps:3trilliontrees')}
        </div>
      </div>
    </div>
  );
};

export default MapLayers;

import { useState, ChangeEvent } from 'react';
import style from '../Explore/Explore.module.scss';
import { MapLayerToggle } from './ExploreProject';
import InfoIcon from '../icons/InfoIcon';
import { StyledSwitch } from './CustomSwitch';
import { YearRangeSlider } from './ExploreProject';
import { useTranslation } from 'next-i18next';
import themeProperties from '../../theme/themeProperties';

const MayLayerOptions = () => {
  const [checked, setChecked] = useState(false);
  const { t } = useTranslation(['allProjects', 'maps']);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const {
    primaryColorNew,
    restorationToggleColorNew,
    deforestrationToggleColorNew,
  } = themeProperties;
  return (
    <div className={style.exploreMainContainer}>
      <div className={style.exploreContainer}>
        <div>
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={t('allProjects:currentForests')}
            switchComponent={<StyledSwitch colors={`${primaryColorNew}`} />}
          />
          <div className={style.hrLine} />
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={t('allProjects:restorationPotential')}
            switchComponent={
              <StyledSwitch colors={`${restorationToggleColorNew}`} />
            }
          />
          <div className={style.hrLine} />
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={t('allProjects:deforestation')}
            switchComponent={
              <StyledSwitch
                colors={`${deforestrationToggleColorNew}`}
                onChange={handleChange}
              />
            }
          />
          {checked && <YearRangeSlider />}
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

export default MayLayerOptions;

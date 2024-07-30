import { useState, ChangeEvent } from 'react';
import style from '../Explore/Explore.module.scss';
import { MapLayerToggle } from './ExploreProject';
import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
import { StyledSwitch } from './CustomSwitch';
import { YearRangeSlider } from './ExploreProject';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';

const MayLayerOptions = () => {
  const [checked, setChecked] = useState(false);
  const tAllProjects = useTranslations('AllProjects');
  const tMaps = useTranslations('Maps');

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
            label={tAllProjects('currentForests')}
            switchComponent={
              <StyledSwitch customColor={`${primaryColorNew}`} />
            }
          />
          <div className={style.hrLine} />
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={tAllProjects('restorationPotential')}
            switchComponent={
              <StyledSwitch customColor={`${restorationToggleColorNew}`} />
            }
          />
          <div className={style.hrLine} />
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={tAllProjects('deforestation')}
            switchComponent={
              <StyledSwitch
                customColor={`${deforestrationToggleColorNew}`}
                onChange={handleChange}
              />
            }
          />
          {checked && <YearRangeSlider />}
          <div className={style.hrLine} />
          <MapLayerToggle
            infoIcon={undefined}
            label={tAllProjects('projects')}
            switchComponent={<StyledSwitch />}
          />
        </div>
        <div className={style.exploreDescription}>
          {tMaps('3trilliontrees')}
        </div>
      </div>
    </div>
  );
};

export default MayLayerOptions;

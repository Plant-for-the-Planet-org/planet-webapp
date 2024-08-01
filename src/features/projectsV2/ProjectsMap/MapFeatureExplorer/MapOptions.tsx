import { useState, ChangeEvent, FC } from 'react';
import styles from './MapFeatureExplorer.module.scss';
import { MapLayerToggle } from '.';
import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
import { StyledSwitch } from './CustomSwitch';
import { YearRangeSlider } from '.';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
import { useProjectsMap } from '../../ProjectsMapContext';

const MapOptions: FC = () => {
  const [checked, setChecked] = useState(false);
  const tAllProjects = useTranslations('AllProjects');
  const tMaps = useTranslations('Maps');
  const { mapOptions, updateMapOption } = useProjectsMap();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const {
    primaryColorNew,
    restorationToggleColorNew,
    deforestrationToggleColorNew,
  } = themeProperties;
  return (
    <div className={styles.exploreMainContainer}>
      <div className={styles.exploreContainer}>
        <div>
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={tAllProjects('currentForests')}
            switchComponent={
              <StyledSwitch customColor={`${primaryColorNew}`} />
            }
          />
          <div className={styles.hrLine} />
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={tAllProjects('restorationPotential')}
            switchComponent={
              <StyledSwitch customColor={`${restorationToggleColorNew}`} />
            }
          />
          <div className={styles.hrLine} />
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
          <div className={styles.hrLine} />
          <MapLayerToggle
            infoIcon={undefined}
            label={tAllProjects('projects')}
            switchComponent={
              <StyledSwitch
                checked={mapOptions['showProjects']}
                onChange={(
                  _event: ChangeEvent<HTMLInputElement>,
                  checked: boolean
                ) => updateMapOption('showProjects', checked)}
              />
            }
          />
        </div>
        <div className={styles.exploreDescription}>
          {tMaps('3trilliontrees')}
        </div>
      </div>
    </div>
  );
};

export default MapOptions;

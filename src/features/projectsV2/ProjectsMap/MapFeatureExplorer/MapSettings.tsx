import { ChangeEvent, FC } from 'react';
import styles from './MapFeatureExplorer.module.scss';
import { MapLayerToggle } from '.';
import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
import { StyledSwitch } from './CustomSwitch';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
import { useProjectsMap } from '../../ProjectsMapContext';
import DeforestationSlider from './DeforestationSlider';

const MapSettings: FC = () => {
  const tAllProjects = useTranslations('AllProjects');
  const tMaps = useTranslations('Maps');
  const { mapOptions, updateMapOption } = useProjectsMap();

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
                checked={mapOptions['showDeforestation']}
                onChange={(
                  _event: ChangeEvent<HTMLInputElement>,
                  checked: boolean
                ) => updateMapOption('showDeforestation', checked)}
              />
            }
          />
          {mapOptions['showDeforestation'] && <DeforestationSlider />}
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

export default MapSettings;

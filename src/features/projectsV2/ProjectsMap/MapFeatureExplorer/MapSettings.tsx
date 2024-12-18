import type { ChangeEvent, FC } from 'react';
import type { MapOptions } from '../../ProjectsMapContext';
import type { SetState } from '../../../common/types/common';

import styles from './MapFeatureExplorer.module.scss';
import { MapLayerToggle } from '.';
// import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
import { StyledSwitch } from './CustomSwitch';
// import { YearRangeSlider } from '.';
import { useTranslations } from 'next-intl';
import { ExploreIcon } from '../../../../../public/assets/images/icons/projectV2/ExploreIcon';
import CrossIcon from '../../../../../public/assets/images/icons/projectV2/CrossIcon';
// import themeProperties from '../../../../theme/themeProperties';

type MapSettingsProps = {
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
  isMobile?: boolean;
  setIsOpen?: SetState<boolean>;
};

const MapSettings: FC<MapSettingsProps> = ({
  mapOptions,
  updateMapOption,
  isMobile,
  setIsOpen,
}) => {
  const tAllProjects = useTranslations('AllProjects');
  const tMaps = useTranslations('Maps');
  /* const {
    primaryColorNew,
    restorationToggleColorNew,
    deforestrationToggleColorNew,
  } = themeProperties; */

  return (
    <div className={styles.exploreMainContainer}>
      <div>
        <div>
          {/* <MapLayerToggle
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
              <StyledSwitch customColor={`${deforestrationToggleColorNew}`} />
            }
          />
          <div className={styles.hrLine} /> */}
          {isMobile && setIsOpen && (
            <div className={styles.exploreFeatureMobileHeader}>
              <div className={styles.exploreLabel}>
                <ExploreIcon />
                <p>{tMaps('explore')}</p>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <CrossIcon />
              </button>
            </div>
          )}
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

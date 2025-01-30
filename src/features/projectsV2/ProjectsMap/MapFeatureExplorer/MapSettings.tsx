import type { FC } from 'react';
import type { MapOptions } from '../../ProjectsMapContext';
import type { SetState } from '../../../common/types/common';

import styles from './MapFeatureExplorer.module.scss';
// // import { MapLayerToggle } from '.';
// import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
// import { StyledSwitch } from './CustomSwitch';
// import { YearRangeSlider } from '.';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
import MapSettingsSection from './microComponents/MapSettingsSection';
import MobileMapSettingsLayout from './MobileMapSettingsLayout';
import { mapSettingsConfig } from '../../../../utils/mapsV2/mapSettings.config';

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
  const tMaps = useTranslations('Maps');

  const content = (
    <>
      <MapSettingsSection config={mapSettingsConfig.projects} />
      <MapSettingsSection
        groupKey="forests"
        config={mapSettingsConfig.forests}
      />
      <MapSettingsSection groupKey="soil" config={mapSettingsConfig.soil} />
      <MapSettingsSection
        groupKey="biodiversity"
        config={mapSettingsConfig.biodiversity}
      />
      <MapSettingsSection groupKey="risks" config={mapSettingsConfig.risks} />
      {/* <MapSettingsSection
        exploreConfig={projectConfig}
        updateMapOption={updateMapOption}
        mapOptions={mapOptions}
      />
      <MapSettingsSection
        category={tMaps('layers.forests')}
        exploreConfig={forestConfig}
      />
      <MapSettingsSection
        category={tMaps('layers.forests')}
        exploreConfig={forestConfig}
      />
      <MapSettingsSection
        category={tMaps('layers.forests')}
        exploreConfig={forestConfig}
      />
      <MapSettingsSection
        category={tMaps('layers.forests')}
        exploreConfig={forestConfig}
      /> */}
      <div className={styles.exploreDescription}>{tMaps('3trilliontrees')}</div>
    </>
  );

  if (isMobile && setIsOpen) {
    return (
      <MobileMapSettingsLayout setIsOpen={setIsOpen}>
        {content}
      </MobileMapSettingsLayout>
    );
  }

  return (
    <div className={styles.exploreMainContainer}>
      <div className={styles.exploreItemsContainer}>
        {/* <MapLayerToggle
            label={tAllProjects('currentForests')}
            switchComponent={
              <StyledSwitch customColor={`${primaryColorNew}`} />
            }
          /> */}
        {/* <div className={styles.hrLine} />
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
          /> */}
        {/* <div className={styles.hrLine} /> */}
        {/* <MapLayerToggle
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
          /> */}
        {content}
      </div>
    </div>
  );
};

export default MapSettings;

import type { FC } from 'react';
import type { MapOptions } from '../../ProjectsMapContext';
import type { SetState } from '../../../common/types/common';

import styles from './MapFeatureExplorer.module.scss';
// // import { MapLayerToggle } from '.';
// import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
// import { StyledSwitch } from './CustomSwitch';
// import { YearRangeSlider } from '.';
import { useTranslations } from 'next-intl';
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
            infoIcon={<InfoIcon width={'10px'} />}
            label={tAllProjects('deforestation')}
            switchComponent={
              <StyledSwitch customColor={`${deforestrationToggleColorNew}`} />
            }
          /> */}
        {content}
      </div>
    </div>
  );
};

export default MapSettings;

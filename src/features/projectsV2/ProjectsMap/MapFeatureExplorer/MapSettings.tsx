import type { FC } from 'react';
import type { MapOptions } from '../../ProjectsMapContext';
import type { SetState } from '../../../common/types/common';

import { useTranslations } from 'next-intl';
import MapSettingsSection from './microComponents/MapSettingsSection';
import MobileMapSettingsLayout from './MobileMapSettingsLayout';
import { mapSettingsConfig } from '../../../../utils/mapsV2/mapSettings.config';
import styles from './MapFeatureExplorer.module.scss';

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
      <MapSettingsSection
        config={mapSettingsConfig.projects}
        mapOptions={mapOptions}
        updateMapOption={updateMapOption}
      />
      <MapSettingsSection
        groupKey="forests"
        config={mapSettingsConfig.forests}
        mapOptions={mapOptions}
        updateMapOption={updateMapOption}
      />
      <MapSettingsSection
        groupKey="soil"
        config={mapSettingsConfig.soil}
        mapOptions={mapOptions}
        updateMapOption={updateMapOption}
      />
      <MapSettingsSection
        groupKey="biodiversity"
        config={mapSettingsConfig.biodiversity}
        mapOptions={mapOptions}
        updateMapOption={updateMapOption}
      />
      <MapSettingsSection
        groupKey="risks"
        config={mapSettingsConfig.risks}
        mapOptions={mapOptions}
        updateMapOption={updateMapOption}
      />
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
      <div className={styles.exploreItemsContainer}>{content}</div>
    </div>
  );
};

export default MapSettings;

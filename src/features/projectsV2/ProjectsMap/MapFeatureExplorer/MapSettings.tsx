import type { MapOptions } from '../../../common/types/map';
import type { ForwardedRef } from 'react';
import type { SetState } from '../../../common/types/common';

import { forwardRef } from 'react';
import MapSettingsSection from './microComponents/MapSettingsSection';
import MobileMapSettingsLayout from './MobileMapSettingsLayout';
import { mapSettingsConfig } from '../../../../utils/mapsV2/mapSettings.config';
import styles from './MapFeatureExplorer.module.scss';

type MapSettingsProps = {
  /** Referenced by the explore toggle's `aria-controls` */
  id?: string;
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
  isMobile?: boolean;
  setIsOpen?: SetState<boolean>;
};

const MapSettings = (
  { id, mapOptions, updateMapOption, isMobile, setIsOpen }: MapSettingsProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
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
      <MapSettingsSection
        groupKey="soil"
        config={mapSettingsConfig.soil}
        mapOptions={mapOptions}
        updateMapOption={updateMapOption}
      />
    </>
  );

  if (isMobile && setIsOpen) {
    return (
      <MobileMapSettingsLayout ref={ref} id={id} setIsOpen={setIsOpen}>
        {content}
      </MobileMapSettingsLayout>
    );
  }

  return (
    <div ref={ref} id={id} className={styles.exploreMainContainer}>
      <div className={styles.exploreItemsContainer}>{content}</div>
    </div>
  );
};

// Forwards the ref so the mobile MUI Modal can move focus into the panel on open and back on close
export default forwardRef(MapSettings);

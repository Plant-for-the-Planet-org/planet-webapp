import type { MapOptions } from '../../ProjectsMapContext';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import { ExploreIcon } from '../../../../../public/assets/images/icons/projectV2/ExploreIcon';
import CustomButton from './CustomButton';
import MapSettings from './MapSettings';
import styles from './MapFeatureExplorer.module.scss';

type MapFeatureExplorerProps = {
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
  isMobile?: boolean;
};

const MapFeatureExplorer = ({
  mapOptions,
  updateMapOption,
  isMobile,
}: MapFeatureExplorerProps) => {
  const tExplore = useTranslations('Maps.exploreLayers');
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.mapFeatureExplorer}>
      <CustomButton
        startIcon={<ExploreIcon />}
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.exploreButton} ${isOpen ? 'active' : ''}`}
      >
        <div className={styles.exploreButtonContent}>
          <h3>{tExplore('title')}</h3>
          {!isMobile && <p>{tExplore('subtitle')}</p>}
        </div>
      </CustomButton>

      {isOpen && !isMobile && (
        <MapSettings
          mapOptions={mapOptions}
          updateMapOption={updateMapOption}
        />
      )}
      {isMobile && (
        <Modal
          open={isOpen}
          aria-labelledby="map-settings-menu"
          onClose={(_event, reason) => {
            if (reason === 'backdropClick') {
              setIsOpen(false);
            }
          }}
        >
          <MapSettings
            mapOptions={mapOptions}
            updateMapOption={updateMapOption}
            isMobile={isMobile}
            setIsOpen={setIsOpen}
          />
        </Modal>
      )}
    </div>
  );
};

export default MapFeatureExplorer;

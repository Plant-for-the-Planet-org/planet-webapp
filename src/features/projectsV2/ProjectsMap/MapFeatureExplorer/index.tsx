import type { MapOptions } from '../../ProjectsMapContext';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import { ExploreIcon } from '../../../../../public/assets/images/icons/projectV2/ExploreIcon';
import CustomButton from './CustomButton';
import MapSettings from './MapSettings';
import styles from './MapFeatureExplorer.module.scss';

interface EcosystemOptionProps {
  label: string;
  switchComponent: React.ReactNode;
}

export const MapLayerToggle = ({
  label,
  switchComponent,
}: EcosystemOptionProps) => {
  return (
    <>
      <div className={styles.toggleMainContainer}>
        <div className={styles.toggleContainer}>
          <div>{label}</div>
        </div>
        <div className={styles.switchContainer}>{switchComponent}</div>
      </div>
    </>
  );
};

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
  const t = useTranslations('Maps');
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.mapFeatureExplorer}>
      <CustomButton
        startIcon={<ExploreIcon />}
        onClick={() => setIsOpen(!isOpen)}
        className={isOpen ? 'active' : ''}
      >
        <div className={styles.exploreButtonContent}>
          <h3>{t('explore')}</h3>
          {!isMobile && <p>Ecological Data Layers</p>}
        </div>
      </CustomButton>

      {isOpen && !isMobile && (
        <MapSettings
          mapOptions={mapOptions}
          updateMapOption={updateMapOption}
        />
      )}
      {isMobile && (
        <Modal open={isOpen}>
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

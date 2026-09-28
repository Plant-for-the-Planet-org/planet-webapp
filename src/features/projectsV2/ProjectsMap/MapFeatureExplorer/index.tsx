import type { MapOptions } from '../../../common/types/map';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@mui/material';
import { ExploreIcon } from '../../../../../public/assets/images/icons/projectV2/ExploreIcon';
import CustomButton from './CustomButton';
import MapSettings from './MapSettings';
import styles from './MapFeatureExplorer.module.scss';
import { clsx } from 'clsx';

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
  // Associates the toggle with the layer settings panel it opens
  const panelId = useId();
  return (
    <div className={styles.mapFeatureExplorer}>
      <CustomButton
        startIcon={<ExploreIcon />}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(styles.exploreButton, { active: isOpen })}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
      >
        <div className={styles.exploreButtonContent}>
          <span className={styles.exploreTitle}>{tExplore('title')}</span>
          {!isMobile && <p>{tExplore('subtitle')}</p>}
        </div>
      </CustomButton>

      {isOpen && !isMobile && (
        <MapSettings
          id={panelId}
          mapOptions={mapOptions}
          updateMapOption={updateMapOption}
        />
      )}
      {isMobile && (
        <Modal
          open={isOpen}
          onClose={(_event, reason) => {
            if (reason === 'backdropClick') {
              setIsOpen(false);
            }
          }}
        >
          <MapSettings
            id={panelId}
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

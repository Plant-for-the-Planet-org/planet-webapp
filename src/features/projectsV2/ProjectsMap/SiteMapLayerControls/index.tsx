import type { LayerOption } from './SiteLayerOptions';

import { useState } from 'react';
import LayerInfoPopup from './LayerInfoPopup';
import SiteLayerInfo from './SiteLayerInfo';
import SiteLayerSelector from './SiteLayerSelector';
import { availableLayerOptions } from './SiteLayerOptions';
import styles from './SiteMapLayerControls.module.scss';

const SiteMapLayerControls = () => {
  const [isLayerInfoOpen, setIsLayerInfoOpen] = useState(false);
  // TODO: move to context
  const [selectedLayer, setSelectedLayer] = useState<LayerOption>(
    availableLayerOptions[0]
  );

  const closeLayerInfoPopup = () => {
    setIsLayerInfoOpen(false);
  };

  const openLayerInfoPopup = () => {
    setIsLayerInfoOpen(true);
  };

  return (
    <div className={styles.siteMapLayerControls}>
      {isLayerInfoOpen && (
        <LayerInfoPopup
          closePopup={closeLayerInfoPopup}
          selectedLayer={selectedLayer}
        />
      )}
      <SiteLayerSelector
        setSelectedLayer={setSelectedLayer}
        selectedLayer={selectedLayer}
      />
      <SiteLayerInfo
        openInfoPopup={openLayerInfoPopup}
        selectedLayer={selectedLayer}
      />
    </div>
  );
};

export default SiteMapLayerControls;

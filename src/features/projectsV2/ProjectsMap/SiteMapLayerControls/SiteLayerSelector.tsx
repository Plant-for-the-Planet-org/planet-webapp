import type { LayerOption } from './SiteLayerOptions';

import SiteLayerDropdown from './SiteLayerDropdown';
import styles from './SiteMapLayerControls.module.scss';

interface SiteLayerSelectorProps {
  setSelectedLayer: (layer: LayerOption) => void;
  selectedLayer: LayerOption;
}

const SiteLayerSelector = ({
  setSelectedLayer,
  selectedLayer,
}: SiteLayerSelectorProps) => {
  return (
    <div className={styles.siteLayerSelector}>
      <SiteLayerDropdown
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
      />
      <p className={styles.timePeriodText}>Since project begin 2018</p>
    </div>
  );
};
export default SiteLayerSelector;

import type { SiteLayerOption } from '../../../../utils/mapsV2/siteLayerOptions';

import LayerInfoTooltip from './LayerInfoTooltip';
import SiteLayerLegend from './SiteLayerLegend';
import styles from './SiteMapLayerControls.module.scss';

interface SiteLayerInfoProps {
  selectedLayer: SiteLayerOption;
  openInfoPopup: () => void;
}

const SiteLayerInfo = ({
  selectedLayer,
  openInfoPopup,
}: SiteLayerInfoProps) => {
  return (
    <div className={styles.siteLayerInfo}>
      <SiteLayerLegend selectedLayer={selectedLayer} />
      <LayerInfoTooltip showInfo={openInfoPopup} />
    </div>
  );
};
export default SiteLayerInfo;

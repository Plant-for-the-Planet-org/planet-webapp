import LayerInfoTooltip from './LayerInfoTooltip';
import SiteLayerLegend from './SiteLayerLegend';
import styles from './SiteMapLayerControls.module.scss';

interface SiteLayerInfoProps {
  openInfoPopup: () => void;
}

const SiteLayerInfo = ({ openInfoPopup }: SiteLayerInfoProps) => {
  return (
    <div className={styles.siteLayerInfo}>
      <SiteLayerLegend />
      <LayerInfoTooltip showInfo={openInfoPopup} />
    </div>
  );
};
export default SiteLayerInfo;

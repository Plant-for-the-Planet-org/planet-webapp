import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
import styles from './SiteMapLayerControls.module.scss';

interface LayerInfoTooltipProps {
  showInfo: () => void;
}

const LayerInfoTooltip = ({ showInfo }: LayerInfoTooltipProps) => {
  return (
    <div className={styles.layerInfoTooltip} onClick={showInfo}>
      <InfoIcon width={12} />
    </div>
  );
};
export default LayerInfoTooltip;

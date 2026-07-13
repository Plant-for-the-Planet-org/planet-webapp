import { useTranslations } from 'next-intl';
import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
import styles from './SiteMapLayerControls.module.scss';

interface LayerInfoTooltipProps {
  showInfo: () => void;
}

const LayerInfoTooltip = ({ showInfo }: LayerInfoTooltipProps) => {
  const tMaps = useTranslations('Maps');
  return (
    <button
      type="button"
      className={styles.layerInfoTooltip}
      onClick={showInfo}
      aria-label={tMaps('layerInfo')}
    >
      <InfoIcon width={12} />
    </button>
  );
};
export default LayerInfoTooltip;

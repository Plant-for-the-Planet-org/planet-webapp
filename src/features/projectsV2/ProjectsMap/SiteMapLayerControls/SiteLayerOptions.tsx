import { useTranslations } from 'next-intl';
import type { SiteLayerOption } from '../../../../utils/mapsV2/siteLayerOptions';

import styles from './SiteMapLayerControls.module.scss';
interface SingleOptionProps {
  option: SiteLayerOption;
  isSelected: boolean;
  handleLayerSelection: (layer: SiteLayerOption) => void;
}

const SingleLayerOption = ({
  option,
  isSelected,
  handleLayerSelection,
}: SingleOptionProps) => {
  const tSiteLayers = useTranslations('Maps.siteLayers');

  return (
    <div
      className={`${styles.singleLayerOption} ${
        isSelected ? styles.selected : ''
      }`}
      onClick={() => handleLayerSelection(option)}
    >
      <div className={styles.optionIcon}>{option.icon}</div>
      <p className={styles.optionLabel}>
        {tSiteLayers(`labels.${option.label}`)}
      </p>
    </div>
  );
};

interface SiteLayerOptionProps {
  layerOptions: SiteLayerOption[];
  selectedLayer: SiteLayerOption;
  handleLayerSelection: (layer: SiteLayerOption) => void;
}

const SiteLayerOptions = ({
  layerOptions,
  selectedLayer,
  handleLayerSelection,
}: SiteLayerOptionProps) => {
  return (
    <div className={styles.siteLayerOptions}>
      {layerOptions.map((option) => (
        <SingleLayerOption
          key={option.id}
          option={option}
          isSelected={selectedLayer.id === option.id}
          handleLayerSelection={handleLayerSelection}
        />
      ))}
    </div>
  );
};
export default SiteLayerOptions;

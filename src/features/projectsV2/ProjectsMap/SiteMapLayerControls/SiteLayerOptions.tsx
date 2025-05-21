import type { ReactElement } from 'react';

import styles from './SiteMapLayerControls.module.scss';
import BiomassChangeIcon from '../../../../../public/assets/images/icons/projectV2/BiomassChangeIcon';
import TreeCoverIcon from '../../../../../public/assets/images/icons/projectV2/TreeCoverIcon';

export type LayerKey = 'biomass' | 'tree-cover';

export type LayerOption = {
  id: LayerKey;
  label: string;
  icon: ReactElement;
};

export const availableLayerOptions: LayerOption[] = [
  {
    id: 'biomass',
    label: 'Biomass Change',
    icon: <BiomassChangeIcon />,
  },
  {
    id: 'tree-cover',
    label: 'Tree Cover Change',
    icon: <TreeCoverIcon />,
  },
];

interface SingleOptionProps {
  option: LayerOption;
  isSelected: boolean;
  handleLayerSelection: (layer: LayerOption) => void;
}

const SingleLayerOption = ({
  option,
  isSelected,
  handleLayerSelection,
}: SingleOptionProps) => {
  return (
    <div
      className={`${styles.singleLayerOption} ${
        isSelected ? styles.selected : ''
      }`}
      onClick={() => handleLayerSelection(option)}
    >
      <div className={styles.optionIcon}>{option.icon}</div>
      <p className={styles.optionLabel}>{option.label}</p>
    </div>
  );
};

interface SiteLayerOptionProps {
  layerOptions: LayerOption[];
  selectedLayer: LayerOption;
  handleLayerSelection: (layer: LayerOption) => void;
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

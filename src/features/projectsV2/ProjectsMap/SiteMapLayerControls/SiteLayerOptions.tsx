import type { ReactElement } from 'react';

import styles from './SiteMapLayerControls.module.scss';
import BiomassChangeIcon from '../../../../../public/assets/images/icons/projectV2/BiomassChangeIcon';
import TreeCoverIcon from '../../../../../public/assets/images/icons/projectV2/TreeCoverIcon';
import themeProperties from '../../../../theme/themeProperties';
import { clsx } from 'clsx';

export type LayerKey = 'biomass' | 'tree-cover';

export type RangeLegendData = {
  type: 'range';
  min: number;
  max: number;
  average?: number;
  unit: string;
  gradient: string;
};

export type PercentLegendData = {
  type: 'percent';
  gradient: string;
};

export type LegendData = RangeLegendData | PercentLegendData;

export type LayerOption = {
  id: LayerKey;
  label: string;
  icon: ReactElement;
  legend: LegendData;
};

const { forestGreen, white, hintText, warmRed, primaryColor } =
  themeProperties.designSystem.colors;

export const availableLayerOptions: LayerOption[] = [
  {
    id: 'biomass',
    label: 'Biomass Change',
    icon: <BiomassChangeIcon />,
    legend: {
      type: 'range',
      min: -20,
      max: 20,
      average: 18,
      unit: 'tons',
      gradient: `linear-gradient(270deg, ${forestGreen} 0%, ${white} 49.48%, ${hintText} 75.52%, ${warmRed} 100%)`,
    },
  },
  {
    id: 'tree-cover',
    label: 'Tree Cover Change',
    icon: <TreeCoverIcon />,
    legend: {
      type: 'percent',
      gradient: `linear-gradient(270deg, ${primaryColor} 0%, ${white} 100%)`,
    },
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
      className={clsx(styles.singleLayerOption, isSelected && styles.selected)}
      onClick={() => handleLayerSelection(option)}
      role="button"
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

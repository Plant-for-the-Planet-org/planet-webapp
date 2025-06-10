import type { ReactElement } from 'react';

import BiomassChangeIcon from '../../../public/assets/images/icons/projectV2/BiomassChangeIcon';
import TreeCoverIcon from '../../../public/assets/images/icons/projectV2/TreeCoverIcon';

export type SiteLayerKey = 'biomass' | 'treeCover';
export type SiteLayerLabel = 'biomassChange' | 'treeCoverChange';

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

export type SiteLayerOption = {
  id: SiteLayerKey;
  label: SiteLayerLabel;
  icon: ReactElement;
  legend: LegendData;
  comingSoon?: boolean;
};

// TODO: translations and remove hardcoded text
export const allSiteLayerOptions: SiteLayerOption[] = [
  {
    id: 'biomass',
    label: 'biomassChange',
    icon: <BiomassChangeIcon />,
    legend: {
      type: 'range',
      min: -20,
      max: 20,
      average: 18,
      unit: 'tons',
      gradient:
        'linear-gradient(270deg, #219653 0%, #FFF 49.48%, #BDBDBD 75.52%, #E86F56 100%)',
    },
  },
  {
    id: 'treeCover',
    label: 'treeCoverChange',
    icon: <TreeCoverIcon />,
    legend: {
      type: 'percent',
      gradient: 'linear-gradient(270deg, #007A49 0%, #FFF 100%)',
    },
    comingSoon: true,
  },
];

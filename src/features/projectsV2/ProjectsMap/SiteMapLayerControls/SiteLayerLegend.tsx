import type { LayerOption } from './SiteLayerOptions';

import PercentLegend from './PercentLegend';
import RangeLegend from './RangeLegend';

interface SiteLayerLegendProps {
  selectedLayer: LayerOption;
}

const SiteLayerLegend = ({ selectedLayer }: SiteLayerLegendProps) => {
  const { legend } = selectedLayer;

  switch (legend.type) {
    case 'range':
      return <RangeLegend legend={legend} />;
    case 'percent':
      return <PercentLegend legend={legend} />;
    default:
      return null;
  }
};
export default SiteLayerLegend;

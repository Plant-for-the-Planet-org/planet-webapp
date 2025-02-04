import { useMemo, type ReactElement } from 'react';

import { Layer, Source } from 'react-map-gl-v7/maplibre';
import { tempLayersData } from '../../../utils/mapsV2/tempLayersConfig';

export default function ExploreLayers(): ReactElement {
  const data = tempLayersData.filter(
    (layer) => layer.name === 'Soil Bulk Density'
  )[0];

  const tiles = useMemo(() => [data.tileUrl], []);

  return (
    <Source id="soil" type="raster" tiles={tiles} tileSize={128}>
      <Layer id="soil-bulk-density" source="soil" type="raster" />
    </Source>
  );
}

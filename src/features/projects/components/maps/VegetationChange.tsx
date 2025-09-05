import type { ReactElement } from 'react';

import { Layer, Source } from 'react-map-gl';

interface Props {
  rasterData: Object | null;
}

export default function VegetationChange({ rasterData }: Props): ReactElement {
  return (
    <>
      {rasterData ? (
        <Source
          id="ndvi"
          type="raster"
          tiles={[`${rasterData.evi}`]}
          tileSize={128}
        >
          <Layer id="ndvi-layer" source="ndvi" type="raster" />
        </Source>
      ) : null}
    </>
  );
}

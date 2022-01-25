import React, { ReactElement } from 'react';
import { Layer, Source } from 'react-map-gl';

interface Props {
  beforeId: string;
}

export default function SatelliteLayer({ beforeId }: Props): ReactElement {
  return (
    <>
      <Source
        id="satellite"
        type="raster"
        tiles={[
          'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ]}
        tileSize={256}
      >
        <Layer
          id="satellite-layer"
          beforeId={beforeId ? beforeId : 'locationPolygon'}
          source="satellite"
          type="raster"
        />
      </Source>
    </>
  );
}

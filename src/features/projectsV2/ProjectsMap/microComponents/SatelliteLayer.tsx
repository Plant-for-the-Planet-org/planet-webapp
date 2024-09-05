import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl-v7';

const SatelliteLayer = () => {
  const tiles = useMemo(
    () => [
      'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    []
  );
  return (
    <Source id="satellite" type="raster" tiles={tiles} tileSize={256}>
      <Layer
        id="satellite-layer"
        source="satellite"
        type="raster"
        beforeId="site-polygon-layer"
      />
    </Source>
  );
};

export default SatelliteLayer;

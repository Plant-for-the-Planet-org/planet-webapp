import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl-v7/maplibre';
import { MAIN_MAP_LAYERS } from '../../../../utils/projectV2';

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
        beforeId={MAIN_MAP_LAYERS.SITE_POLYGON_LINE}
      />
    </Source>
  );
};

export default SatelliteLayer;

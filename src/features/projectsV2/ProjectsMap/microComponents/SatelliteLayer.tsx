import { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl-v7/maplibre';
import { MAIN_MAP_LAYERS } from '../../../../utils/projectV2';

const SatelliteLayer = () => {
  const { SATELLITE_LAYER, SITE_POLYGON_LINE } = MAIN_MAP_LAYERS;
  const tiles = useMemo(
    () => [
      'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    []
  );
  return (
    <Source id="satellite" type="raster" tiles={tiles} tileSize={256}>
      <Layer
        id={SATELLITE_LAYER}
        source="satellite"
        type="raster"
        beforeId={SITE_POLYGON_LINE}
      />
    </Source>
  );
};

export default SatelliteLayer;

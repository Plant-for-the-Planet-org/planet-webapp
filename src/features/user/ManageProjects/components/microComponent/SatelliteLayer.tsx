import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl-v7/maplibre';

const SatelliteLayer = () => {
  const tiles = useMemo(
    () => [
      'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    []
  );

  return (
    <Source
      id="satellite-source"
      type="raster"
      tiles={tiles}
      tileSize={256}
      attribution="Esri, Maxar, Earthstar Geographics, and the GIS User Community via Esri World Imagery Wayback"
    >
      <Layer
        type="raster"
        id="satellite-layer"
        beforeId="project-site-outline"
      />
    </Source>
  );
};

export default SatelliteLayer;

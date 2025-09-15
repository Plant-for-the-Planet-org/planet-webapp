import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl-v7';

const SatelliteLayer = () => {
  const tiles = useMemo(
    () => [
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    []
  );

  return (
    <Source id="satellite-source" type="raster" tiles={tiles} tileSize={256}>
      <Layer
        type="raster"
        id="satellite-layer"
        beforeId="project-site-outline"
      />
    </Source>
  );
};

export default SatelliteLayer;

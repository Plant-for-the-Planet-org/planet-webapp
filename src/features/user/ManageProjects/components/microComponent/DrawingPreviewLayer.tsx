import { Source, Layer } from 'react-map-gl-v7/maplibre';
import themeProperties from '../../../../../theme/themeProperties';

interface DrawingPreviewLayerProps {
  coordinates: number[][];
  isSatelliteMode: boolean;
}

const DrawingPreviewLayer = ({
  coordinates,
  isSatelliteMode,
}: DrawingPreviewLayerProps) => {
  const { colors } = themeProperties.designSystem;
  return (
    <Source
      id="drawing-preview"
      type="geojson"
      data={{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
        properties: {},
      }}
    >
      <Layer
        id="drawing-preview-line"
        type="line"
        paint={{
          'line-color': isSatelliteMode ? colors.white : colors.fireRed,
          'line-width': 2,
        }}
      />
    </Source>
  );
};

export default DrawingPreviewLayer;

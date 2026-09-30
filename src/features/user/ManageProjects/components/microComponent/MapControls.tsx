import type { SetState } from '../../../../common/types/common';

import DrawingControls from './DrawingControls';
import LayerToggle from './LayerToggle';

interface MapControllersProp {
  isDrawing: boolean;
  setIsDrawing: SetState<boolean>;
  coordinates: number[][];
  clearCoordinates: () => void;
  isSatelliteMode: boolean;
  setIsSatelliteMode: SetState<boolean>;
}

const MapControls = ({
  isDrawing,
  setIsDrawing,
  coordinates,
  clearCoordinates,
  isSatelliteMode,
  setIsSatelliteMode,
}: MapControllersProp) => {
  return (
    <>
      <DrawingControls
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        coordinates={coordinates}
        clearCoordinates={clearCoordinates}
      />
      <LayerToggle
        isSatelliteMode={isSatelliteMode}
        setIsSatelliteMode={setIsSatelliteMode}
      />
    </>
  );
};

export default MapControls;

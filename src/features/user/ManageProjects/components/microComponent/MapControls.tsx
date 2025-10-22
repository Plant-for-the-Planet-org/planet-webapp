import type { SetState } from '../../../../common/types/common';

import DrawingControls from './DrawingControls';
import LayerToggle from './LayerToggle';

interface MapControllersProp {
  isDrawing: boolean;
  setIsDrawing: SetState<boolean>;
  coordinates: number[][];
  setCoordinates: SetState<number[][]>;
  isSatelliteMode: boolean;
  setIsSatelliteMode: SetState<boolean>;
}

const MapControls = ({
  isDrawing,
  setIsDrawing,
  coordinates,
  setCoordinates,
  isSatelliteMode,
  setIsSatelliteMode,
}: MapControllersProp) => {
  return (
    <>
      <DrawingControls
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
      />
      <LayerToggle
        isSatelliteMode={isSatelliteMode}
        setIsSatelliteMode={setIsSatelliteMode}
      />
    </>
  );
};

export default MapControls;

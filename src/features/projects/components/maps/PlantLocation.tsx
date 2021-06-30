import React, { ReactElement } from 'react';
import { Layer } from 'react-map-gl';
import { Source } from 'react-map-gl';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import { useRouter } from 'next/router';
import { zoomToPlantLocation } from '../../../../utils/maps/plantLocations';
import SatelliteLayer from './SatelliteLayer';

interface Props {}

export default function PlantLocation({}: Props): ReactElement {
  const router = useRouter();
  const {
    project,
    plantLocations,
    zoomLevel,
    mapRef,
    selectedLocation,
    isMobile,
    setViewPort,
    viewport,
    satellite,
  } = React.useContext(ProjectPropsContext);

  React.useEffect(() => {
    if (selectedLocation)
      zoomToPlantLocation(
        selectedLocation.geometry,
        viewport,
        isMobile,
        setViewPort,
        1200
      );
  }, [selectedLocation]);
  return (
    <>
      {satellite && <SatelliteLayer beforeId={'selected-layer'} />}
      {selectedLocation && (
        <Source
          id={selectedLocation.id}
          type="geojson"
          data={selectedLocation.geometry}
        >
          <Layer
            id={`selected-layer`}
            type="line"
            source={selectedLocation.id}
            paint={{
              'line-color': '#007A49',
              'line-width': 4,
            }}
          />
          <Layer
            id={`${selectedLocation.id}-layer-bg`}
            type="fill"
            source={selectedLocation.id}
            paint={{
              'fill-color': '#007A49',
              'fill-opacity': 0.3,
            }}
          />
        </Source>
      )}
    </>
  );
}

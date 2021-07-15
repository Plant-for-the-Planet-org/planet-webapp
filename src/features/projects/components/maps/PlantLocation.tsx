import React, { ReactElement } from 'react';
import { Layer, Marker } from 'react-map-gl';
import { Source } from 'react-map-gl';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import { useRouter } from 'next/router';
import { zoomToPlantLocation } from '../../../../utils/maps/plantLocations';
import SatelliteLayer from './SatelliteLayer';
import styles from '../../styles/PlantLocation.module.scss';

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

  // React.useEffect(() => {
  //   if (selectedLocation)
  //     zoomToPlantLocation(
  //       selectedLocation.geometry,
  //       viewport,
  //       isMobile,
  //       setViewPort,
  //       1200
  //     );
  // }, [selectedLocation]);
  return (
    <>
      {satellite && <SatelliteLayer beforeId={'selected-layer'} />}
      {selectedLocation && selectedLocation.type === 'multi' && (
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

      {selectedLocation && selectedLocation.type === 'single' && (
        <Marker
          key={selectedLocation.id}
          latitude={selectedLocation.geometry.coordinates[1]}
          longitude={selectedLocation.geometry.coordinates[0]}
        >
          <div className={styles.single} role="button" tabIndex={0} />
        </Marker>
      )}
      {selectedLocation &&
        selectedLocation.samplePlantLocations &&
        selectedLocation.samplePlantLocations.map((spl: any) => {
          return (
            <Marker
              key={spl.id}
              latitude={spl.geometry.coordinates[1]}
              longitude={spl.geometry.coordinates[0]}
            >
              <div className={styles.single} role="button" tabIndex={0} />
            </Marker>
          );
        })}
    </>
  );
}
